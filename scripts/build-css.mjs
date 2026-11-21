// Inlines packages/core/src/styles/index.css (and its @imports) into dist/styles.css.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'packages/core');
const inline = (file) =>
  readFileSync(file, 'utf8').replace(/@import\s+'([^']+)';/g, (_, rel) => inline(join(dirname(file), rel)));

const css = inline(join(root, 'src/styles/index.css'));
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/styles.css'), css);
console.log(`styles.css: ${(Buffer.byteLength(css) / 1024).toFixed(1)} KB`);
