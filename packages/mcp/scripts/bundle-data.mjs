// Copies the generated docs and registry into the package so the server works offline.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const registry = path.resolve(here, '../../../registry');
const data = path.resolve(here, '../data');
fs.rmSync(data, { recursive: true, force: true });
fs.cpSync(registry, data, { recursive: true, filter: (f) => !f.endsWith('.txt') });
console.log('bundled', fs.readdirSync(path.join(data, 'r')).length, 'registry items');
