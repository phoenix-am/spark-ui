// Writes one tiny index.d.ts per tsup entry that re-exports the
// declarations tsc emitted to dist/types. (tsup's own dts step ran out of
// memory once the library had ~40 entry points.)
import fs from 'node:fs';
import path from 'node:path';

const cfg = fs.readFileSync('tsup.config.ts', 'utf8');
const entries = [...cfg.matchAll(/['"]([\w/-]+)['"]:\s*['"]src\/([\w/.-]+)\.tsx?['"]/g)];
if (!entries.length) throw new Error('build-dts: no entries found in tsup.config.ts');
for (const [, out, src] of entries) {
  const file = path.join('dist', `${out}.d.ts`);
  const target = path.relative(path.dirname(file), path.join('dist', 'types', src)).split(path.sep).join('/');
  const spec = target.startsWith('.') ? target : `./${target}`;
  const types = path.join('dist', 'types', `${src}.d.ts`);
  if (!fs.existsSync(types)) throw new Error(`build-dts: missing ${types}`);
  const hasDefault = /export default|export \{[^}]*\bdefault\b/.test(fs.readFileSync(types, 'utf8'));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const body = `export * from '${spec}';\n${hasDefault ? `export { default } from '${spec}';\n` : ''}`;
  fs.writeFileSync(file, body);
  fs.writeFileSync(file.replace(/\.d\.ts$/, '.d.mts'), body);
}
console.log(`build-dts: ${entries.length} entry declarations`);
