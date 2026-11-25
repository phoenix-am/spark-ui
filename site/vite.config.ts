import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..');

export default defineConfig({
  root: here,
  // GitHub Pages serves the site under /<repo>/; set SITE_BASE=/spark-ui/ there.
  base: process.env.SITE_BASE ?? '/',
  plugins: [react()],
  resolve: {
    alias: [
      // Use the components' source, so the site always shows the current code.
      // Blocks are copied into apps by the CLI; demos import them from the path the CLI uses.
      { find: /^@\/components\/spark-ui\//, replacement: path.join(repo, 'packages/core/src') + '/' },
      { find: /^@sparkwire\/core\/(base|headless)$/, replacement: path.join(repo, 'packages/core/src') + '/$1' },
      { find: /^@sparkwire\/([a-z-]+)$/, replacement: path.join(repo, 'packages/$1/src') },
    ],
  },
  server: { fs: { allow: [repo] } },
  build: { outDir: path.join(repo, 'site-dist'), emptyOutDir: true, chunkSizeWarningLimit: 1500 },
});
