import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/app.ts'],
  outDir: 'dist',
  format: ['esm'],
  target: 'node18',
  clean: true,
  splitting: false,
  dts: true,
  external: ['dotenv', '@prisma/client'],
});
