import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/jest.config.base.ts',
    'src/jest.setup.base.ts',
    'src/jest.transform.base.ts',
    'src/util.ts',
    'src/mocks/**/*',
  ],
  format: ['cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
});
