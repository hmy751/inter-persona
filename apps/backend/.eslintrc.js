/** @type {import("eslint").Linter.Config} */

module.exports = {
  root: true,
  extends: ['@repo/eslint-config/node'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
  },
  ignorePatterns: ['.*.js', 'node_modules/', 'dist/'],
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      env: {
        jest: true,
      },
    },
  ],
};
