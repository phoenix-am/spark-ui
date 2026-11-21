import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'index.ts' },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  target: 'es2019',
  external: ['react', 'react-dom'],
});
