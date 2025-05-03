/** @type {import("eslint").Linter.Config} */

module.exports = {
  extends: ['./base.js'],
  env: {
    node: true, // Node.js 환경 활성화
    es2022: true,
  },
  // Node.js 환경에만 적용할 특화 규칙 추가 (필요시)
  rules: {},
};
