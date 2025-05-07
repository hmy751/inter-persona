import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/message.ts', 'src/name.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'es2020',
});
