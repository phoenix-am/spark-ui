// Regenerate tokens.css before every core build so CSS always matches theme.ts.
import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
execSync('node scripts/build-tokens.mjs', { cwd: resolve(dirname(fileURLToPath(import.meta.url)), '..'), stdio: 'inherit' });
