// Run: node --test packages/cli/test
// Each case builds a throwaway project and a hostile local registry in the OS temp folder.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const BIN = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../bin/sparkwire.mjs');

function sandbox(item) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sparkwire-'));
  const project = path.join(root, 'project');
  fs.mkdirSync(path.join(root, 'registry', 'r'), { recursive: true });
  fs.mkdirSync(project);
  fs.writeFileSync(path.join(project, 'package.json'), '{"name":"app"}');
  fs.writeFileSync(path.join(root, 'registry', 'r', `${item.name}.json`), JSON.stringify(item));
  return { root, project, registry: path.join(root, 'registry') };
}

function add(box, name, ...extra) {
  return spawnSync(process.execPath, [BIN, 'add', name, '--registry', box.registry, '--cwd', box.project, '--dir', 'src/components', ...extra], { encoding: 'utf8' });
}

const file = (target, content = 'x') => ({ path: 'x.tsx', type: 'registry:ui', target, content });

test('writes a normal component inside the project', () => {
  const box = sandbox({ name: 'ok', files: [file('components/spark-ui/Ok/Ok.tsx', 'export {}')] });
  const r = add(box, 'ok', '--no-install');
  assert.equal(r.status, 0, r.stderr);
  assert.ok(fs.existsSync(path.join(box.project, 'src/components/Ok/Ok.tsx')));
});

for (const target of ['../OWNED.txt', '../../OWNED.txt', 'components/spark-ui/../../../OWNED.txt', '/tmp/OWNED-abs.txt', 'C:\\OWNED.txt', '..\\OWNED.txt']) {
  test(`refuses a file target outside the project: ${target}`, () => {
    const box = sandbox({ name: 'evil', files: [file(target)] });
    const r = add(box, 'evil', '--no-install');
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /outside your project/);
    assert.ok(!fs.existsSync(path.join(box.root, 'OWNED.txt')));
    assert.ok(!fs.existsSync('/tmp/OWNED-abs.txt'));
  });
}

test('one hostile file means no file is written', () => {
  const box = sandbox({ name: 'evil', files: [file('components/spark-ui/Fine.tsx'), file('../OWNED.txt')] });
  const r = add(box, 'evil', '--no-install');
  assert.notEqual(r.status, 0);
  assert.ok(!fs.existsSync(path.join(box.project, 'src/components/Fine.tsx')), 'checks every file before writing any');
});

for (const dep of ['--registry=https://attacker.invalid/', '-g', 'a&calc', 'left-pad;rm -rf ~', 'x@"1"', 'x@%PATH%', 'x@$(id)', '']) {
  test(`refuses a dependency that is not a package spec: ${JSON.stringify(dep)}`, () => {
    const box = sandbox({ name: 'evil', files: [file('components/spark-ui/E.tsx')], dependencies: ['left-pad', dep] });
    const r = add(box, 'evil', '--dry-run');
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /not a valid npm package spec/);
  });
}

test('accepts the dependency specs the real registry uses', () => {
  const deps = ['react-aria@^3.53.1', '@react-types/shared@^3.37.0', '@internationalized/date@^3.12.4', 'left-pad', 'x@>=1 <2', 'x@~1.2.3 || ^2'];
  const box = sandbox({ name: 'fine', files: [file('components/spark-ui/F.tsx')], dependencies: deps });
  const r = add(box, 'fine', '--dry-run');
  assert.equal(r.status, 0, r.stderr);
});

for (const name of ['../../etc/passwd', 'a/b', 'A', 'x y']) {
  test(`refuses an invalid component name: ${name}`, () => {
    const box = sandbox({ name: 'ok', files: [] });
    const r = add(box, name, '--dry-run');
    assert.notEqual(r.status, 0);
  });
}

test('refuses an invalid name in registryDependencies', () => {
  const box = sandbox({ name: 'evil', files: [], registryDependencies: ['../../secret'] });
  const r = add(box, 'evil', '--dry-run');
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Invalid component name/);
});
