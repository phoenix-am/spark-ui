#!/usr/bin/env node
/**
 * Bundle-size budget. Bundles what an app would import from the built packages, the way
 * an app's bundler would (minified, tree-shaken, React and other dependencies left out),
 * and compares the gzipped size with scripts/size-budget.json.
 *
 *   npm run size            check against the budget (fails CI when over)
 *   npm run size -- --write record the current sizes as the new budget (+8% headroom)
 *
 * Run `npm run build` first.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUDGET = path.join(root, 'scripts/size-budget.json');
const HEADROOM = 1.08;

const core = path.join(root, 'packages/core');
const pkg = JSON.parse(fs.readFileSync(path.join(core, 'package.json'), 'utf8'));
// Everything the app installs anyway is not counted against Sparkwire.
const external = [...Object.keys(pkg.peerDependencies ?? {}), ...Object.keys(pkg.dependencies ?? {})].flatMap((n) => [n, `${n}/*`]);

/** What people import. Each line is measured on its own, as an app that uses only that would ship it. */
const CHECKS = [
  { name: 'Button (from the root)', code: `export { Button } from '@sparkwire/core';` },
  { name: 'Switch + Textfield + Checkbox', code: `export { Switch, Textfield, Checkbox } from '@sparkwire/core';` },
  { name: 'DatePicker', code: `export { DatePicker } from '@sparkwire/core';` },
  { name: 'DataTable', code: `export { DataTable } from '@sparkwire/core';` },
  { name: 'Charts (LineChart, BarChart)', code: `export { LineChart, BarChart } from '@sparkwire/core';` },
  { name: 'CommandPalette', code: `export { CommandPalette } from '@sparkwire/core';` },
  { name: 'Everything in @sparkwire/core', code: `export * from '@sparkwire/core';` },
];
const CSS = [{ name: 'styles.css', file: path.join(core, 'dist/styles.css') }];

const gzip = (buf) => zlib.gzipSync(buf, { level: 9 }).length;
const kb = (n) => `${(n / 1024).toFixed(1)} kB`;

async function measure(code) {
  const out = await build({
    stdin: { contents: code, resolveDir: root, loader: 'js' },
    bundle: true,
    write: false,
    minify: true,
    treeShaking: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2020',
    external,
    alias: { '@sparkwire/core': path.join(core, 'dist/index.mjs') },
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'silent',
  });
  return gzip(out.outputFiles[0].contents);
}

if (!fs.existsSync(path.join(core, 'dist/index.mjs'))) {
  console.error('No build found. Run `npm run build` first.');
  process.exit(1);
}

const results = [];
for (const c of CHECKS) results.push({ name: c.name, size: await measure(c.code) });
for (const c of CSS) results.push({ name: c.name, size: gzip(fs.readFileSync(c.file)) });

if (process.argv.includes('--write')) {
  const budget = Object.fromEntries(results.map((r) => [r.name, Math.ceil((r.size * HEADROOM) / 100) * 100]));
  fs.writeFileSync(BUDGET, JSON.stringify(budget, null, 2) + '\n');
  for (const r of results) console.log(`${r.name.padEnd(34)} ${kb(r.size).padStart(9)}  budget ${kb(budget[r.name])}`);
  console.log(`\nWrote ${path.relative(root, BUDGET)}`);
  process.exit(0);
}

const budget = fs.existsSync(BUDGET) ? JSON.parse(fs.readFileSync(BUDGET, 'utf8')) : {};
let failed = false;
console.log('gzipped, React and other dependencies excluded\n');
for (const r of results) {
  const limit = budget[r.name];
  const over = limit !== undefined && r.size > limit;
  if (over || limit === undefined) failed = true;
  const note = limit === undefined ? 'no budget' : over ? `OVER by ${kb(r.size - limit)}` : `${Math.round((r.size / limit) * 100)}% of ${kb(limit)}`;
  console.log(`${over || limit === undefined ? '✖' : '✓'} ${r.name.padEnd(34)} ${kb(r.size).padStart(9)}  ${note}`);
}
if (failed) {
  console.error('\nOver budget. If the growth is intended, run `npm run size -- --write` and commit scripts/size-budget.json.');
  process.exit(1);
}
