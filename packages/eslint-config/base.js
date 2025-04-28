/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    es2022: true, // 최신 ECMAScript 기능 지원
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    ".turbo/",
    ".*.js",
    "*.config.js",
    "*.config.ts",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    semi: ["error", "error"],
    quotes: ["error", "single"],
    indent: ["error", 2],
    "comma-dangle": ["error", "always-multiline"],
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      { allowExpressions: true },
    ],
    "@typescript-eslint/no-non-null-assertion": "warn",
    "no-undef": "off",
  },
};
