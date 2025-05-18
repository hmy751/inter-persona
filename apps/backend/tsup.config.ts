import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/app.ts'],
  outDir: 'dist',
  format: ['esm'],
  clean: true,
  splitting: false,
  dts: true,
  external: [],
});
