import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/user.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'es2020',
});
