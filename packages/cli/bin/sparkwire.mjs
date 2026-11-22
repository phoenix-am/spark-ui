#!/usr/bin/env node
/**
 * sparkwire: copy Spark UI components into your project as source you own.
 *
 *   npx sparkwire init                 create sparkwire.json
 *   npx sparkwire add switch menu      add components (and what they need)
 *   npx sparkwire list                 show available components
 *
 * Options: --dir <path>  --registry <url-or-folder>  --overwrite  --dry-run
 *          --no-install  --cwd <path>  --yes
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const DEFAULT_REGISTRY = 'https://raw.githubusercontent.com/phoenix-am/spark-ui/master/registry/r/{name}.json';
const TARGET_PREFIX = 'components/spark-ui';
const CONFIG = 'sparkwire.json';

const c = {
  bold: (s) => `\x1b[1m${s}\x1b[22m`,
  dim: (s) => `\x1b[2m${s}\x1b[22m`,
  yellow: (s) => `\x1b[33m${s}\x1b[39m`,
  green: (s) => `\x1b[32m${s}\x1b[39m`,
  red: (s) => `\x1b[31m${s}\x1b[39m`,
};
const fail = (msg) => {
  console.error(`${c.red('✖')} ${msg}`);
  process.exit(1);
};

/* ---------------------------------------------------------------- args */

function parseArgs(argv) {
  const args = { _: [], install: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--no-install') args.install = false;
    else if (a === '--overwrite' || a === '-o') args.overwrite = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--yes' || a === '-y') args.yes = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--version' || a === '-v') args.version = true;
    else if (['--dir', '--registry', '--cwd'].includes(a)) args[a.slice(2)] = argv[++i];
    else if (a.startsWith('--') && a.includes('=')) {
      const [k, v] = a.slice(2).split('=');
      args[k] = v;
    } else args._.push(a);
  }
  return args;
}

/* -------------------------------------------------------------- config */

function readConfig(cwd) {
  const file = path.join(cwd, CONFIG);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

function defaultDir(cwd) {
  return fs.existsSync(path.join(cwd, 'src')) ? 'src/components/spark-ui' : 'components/spark-ui';
}

function settings(args) {
  const cwd = path.resolve(args.cwd ?? process.cwd());
  const config = readConfig(cwd) ?? {};
  return {
    cwd,
    dir: args.dir ?? config.dir ?? defaultDir(cwd),
    registry: args.registry ?? process.env.SPARKWIRE_REGISTRY ?? config.registry ?? DEFAULT_REGISTRY,
  };
}

/* ------------------------------------------------------------ registry */

/** A registry is a URL template with {name}, or a local folder holding r/<name>.json. */
function itemLocation(registry, name) {
  if (/^https?:\/\//.test(registry)) return registry.includes('{name}') ? registry.replace('{name}', name) : `${registry.replace(/\/$/, '')}/r/${name}.json`;
  const base = path.resolve(registry);
  const inR = path.join(base, 'r', `${name}.json`);
  return fs.existsSync(inR) ? inR : path.join(base, `${name}.json`);
}

function indexLocation(registry) {
  if (/^https?:\/\//.test(registry)) return registry.includes('{name}') ? registry.replace(/r\/\{name\}\.json$/, 'registry.json').replace('{name}.json', 'registry.json') : `${registry.replace(/\/$/, '')}/registry.json`;
  return path.join(path.resolve(registry), 'registry.json');
}

async function load(location) {
  if (/^https?:\/\//.test(location)) {
    const res = await fetch(location);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${location}`);
    return res.json();
  }
  if (!fs.existsSync(location)) throw new Error(`not found: ${location}`);
  return JSON.parse(fs.readFileSync(location, 'utf8'));
}

const bare = (dep) => dep.replace(/^@sparkwire\//, '');

/** Load items and everything they depend on, dependencies first. */
async function resolve(names, registry) {
  const seen = new Map();
  const order = [];
  async function visit(name, from) {
    if (seen.has(name)) return;
    seen.set(name, null);
    let item;
    try {
      item = await load(itemLocation(registry, name));
    } catch (e) {
      fail(`Unknown component "${name}"${from ? ` (needed by ${from})` : ''}: ${e.message}\n  Run ${c.bold('npx sparkwire list')} to see what's available.`);
    }
    for (const dep of item.registryDependencies ?? []) await visit(bare(dep), name);
    seen.set(name, item);
    order.push(item);
  }
  for (const n of names) await visit(n);
  return order;
}

/* ------------------------------------------------------------- install */

function packageManager(cwd) {
  const has = (f) => fs.existsSync(path.join(cwd, f));
  if (has('pnpm-lock.yaml')) return 'pnpm';
  if (has('yarn.lock')) return 'yarn';
  if (has('bun.lockb') || has('bun.lock')) return 'bun';
  return 'npm';
}

function missingDeps(cwd, deps) {
  let pkg = {};
  try {
    pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  } catch {
    /* no package.json: install everything */
  }
  const have = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
  return deps.filter((d) => {
    const name = d.startsWith('@') ? '@' + d.slice(1).split('@')[0] : d.split('@')[0];
    return !have[name];
  });
}

function install(cwd, deps) {
  const pm = packageManager(cwd);
  const cmd = pm === 'npm' ? ['install', ...deps] : ['add', ...deps];
  console.log(`${c.dim('$')} ${pm} ${cmd.join(' ')}`);
  const r = spawnSync(pm, cmd, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) fail(`${pm} failed. Install these yourself: ${deps.join(' ')}`);
}

/* ------------------------------------------------------------ commands */

async function add(args) {
  const names = args._.slice(1).map((n) => n.replace(/^@sparkwire\//, '').toLowerCase());
  if (!names.length) fail(`Name at least one component, e.g. ${c.bold('npx sparkwire add switch')}`);
  const { cwd, dir, registry } = settings(args);
  const items = await resolve(names, registry);

  const written = [];
  const skipped = [];
  for (const item of items) {
    for (const file of item.files ?? []) {
      const rel = (file.target ?? file.path).replace(new RegExp(`^${TARGET_PREFIX}`), dir);
      const dest = path.join(cwd, rel);
      if (fs.existsSync(dest) && !args.overwrite) {
        if (fs.readFileSync(dest, 'utf8') !== file.content) skipped.push(rel);
        continue;
      }
      if (!args.dryRun) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, file.content);
      }
      written.push(rel);
    }
  }

  const deps = [...new Set(items.flatMap((i) => i.dependencies ?? []))];
  const toInstall = missingDeps(cwd, deps);

  console.log(`\n${c.yellow('⚡')} ${c.bold(args.dryRun ? 'Would add' : 'Added')} ${items.map((i) => i.name).join(', ')}`);
  for (const f of written) console.log(`  ${c.green('+')} ${f}`);
  if (skipped.length) {
    console.log(`\n${c.bold('Kept your changes')} in ${skipped.length} file(s) (use --overwrite to replace):`);
    for (const f of skipped) console.log(`  ${c.dim('=')} ${f}`);
  }
  if (toInstall.length) {
    if (args.dryRun || !args.install) console.log(`\n${c.bold('Install:')} ${toInstall.join(' ')}`);
    else install(cwd, toInstall);
  }

  const cssPath = `${dir}/styles.css`;
  if (written.includes(cssPath) || items.some((i) => i.name === 'styles')) {
    console.log(`\n${c.bold('One-time setup:')} import the styles once, e.g. in your root layout:`);
    console.log(`  import '${path.relative(cwd, path.join(cwd, cssPath)).startsWith('src/') ? '@/' + cssPath.replace(/^src\//, '') : './' + cssPath}';`);
  }
  const first = items.find((i) => names.includes(i.name));
  // Folder of the item's first file, relative to the install dir (e.g. Button, blocks/Dashboard).
  const folder = first?.files?.[0]?.target?.split('/').slice(2, -1).join('/');
  if (folder) console.log(`\n${c.bold('Use it:')} import { ... } from '${dir.replace(/^src\//, '@/')}/${folder}';\n`);
}

async function list(args) {
  const { registry } = settings(args);
  let index;
  try {
    index = await load(indexLocation(registry));
  } catch (e) {
    fail(`Could not read the registry index: ${e.message}`);
  }
  const internal = new Set(['utils', 'styles']);
  const width = Math.max(...index.items.map((i) => i.name.length));
  console.log(`\n${c.yellow('⚡')} ${c.bold('Spark UI components')} ${c.dim(`(${registry.includes('{name}') ? new URL(registry).host : registry})`)}\n`);
  for (const i of index.items.filter((x) => !internal.has(x.name))) console.log(`  ${i.name.padEnd(width)}  ${c.dim(i.description)}`);
  console.log(`\nAdd one: ${c.bold('npx sparkwire add <name>')}\n`);
}

function init(args) {
  const { cwd, dir, registry } = settings(args);
  const file = path.join(cwd, CONFIG);
  if (fs.existsSync(file) && !args.overwrite) fail(`${CONFIG} already exists (use --overwrite to replace it).`);
  const config = { $schema: 'https://raw.githubusercontent.com/phoenix-am/spark-ui/master/registry/sparkwire.schema.json', dir };
  if (registry !== DEFAULT_REGISTRY) config.registry = registry;
  if (!args.dryRun) fs.writeFileSync(file, JSON.stringify(config, null, 2) + '\n');
  console.log(`${c.green('✔')} ${args.dryRun ? 'Would write' : 'Wrote'} ${CONFIG}: components go to ${c.bold(dir)}`);
}

const HELP = `
${c.yellow('⚡')} ${c.bold('sparkwire')}: add Spark UI components to your project as source you own.

  ${c.bold('npx sparkwire init')}               create sparkwire.json (where components go)
  ${c.bold('npx sparkwire add')} <names...>     copy components and what they need
  ${c.bold('npx sparkwire list')}               show available components

Options
  --dir <path>        folder for components (default: src/components/spark-ui or components/spark-ui)
  --registry <url>    registry URL template with {name}, or a local folder
  --overwrite, -o     replace files you have changed
  --dry-run           show what would happen, change nothing
  --no-install        don't install npm dependencies
  --cwd <path>        run in another folder
`;

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0];
if (args.version) console.log('0.1.0');
else if (args.help || !cmd) console.log(HELP);
else if (cmd === 'add') await add(args);
else if (cmd === 'list' || cmd === 'ls') await list(args);
else if (cmd === 'init') init(args);
else fail(`Unknown command "${cmd}". Run npx sparkwire --help.`);
