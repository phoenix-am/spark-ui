import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2019',
  banner: { js: '"use client";' },
  external: ['react', 'react-dom', /^@sparkwire\//],
});
