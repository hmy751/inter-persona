import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/app.ts'],
  outDir: 'dist',
  format: ['esm'],
  target: 'node20.18.0',
  clean: true,
  splitting: false,
  dts: true,
  external: ['dotenv', '@prisma/client'],
});
