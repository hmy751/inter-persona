module.exports = {
  root: true,
  extends: ["@repo/eslint-config/base.js"],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
  },
  ignorePatterns: [".*.js", "node_modules/", "dist/"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
    },
  ],
};
