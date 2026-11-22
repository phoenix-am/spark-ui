#!/usr/bin/env node
// Publishes every package whose version isn't on npm yet, in dependency order.
// Re-running is safe: versions already published are skipped. Used by the
// Publish workflow (changesets runs it after a Version packages PR is merged).
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const ORDER = ['utils', 'icons', 'styles', 'system', 'core', 'mcp', 'cli'];
const dry = process.argv.includes('--dry-run');
const published = [];
for (const dir of ORDER) {
  const { name, version } = JSON.parse(fs.readFileSync(`packages/${dir}/package.json`, 'utf8'));
  let exists = false;
  try {
    exists = execSync(`npm view ${name}@${version} version`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() === version;
  } catch {}
  if (exists) {
    console.log(`= ${name}@${version} is already on npm`);
    continue;
  }
  console.log(`${dry ? 'Would publish' : 'Publishing'} ${name}@${version}`);
  execSync(dry ? 'npm pack --dry-run' : 'npm publish --access public --provenance', { cwd: `packages/${dir}`, stdio: 'inherit' });
  // changesets/action reads this line to know what was published
  if (!dry) console.log(`New tag: ${name}@${version}`);
  published.push(`${name}@${version}`);
}
console.log(published.length ? `Published ${published.length} package(s).` : 'Nothing new to publish.');
