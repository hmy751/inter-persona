import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/app.ts'],
  outDir: 'dist',
  format: ['esm'],
  target: 'node18',
  shims: true,
  clean: true,
  splitting: false,
  dts: true,
  onSuccess: 'NODE_ENV=development node dist/app.js',
});
