/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 */

/** @type {import("eslint").Linter.Config} */

module.exports = {
  extends: [
    './base.js', // 중앙 설정 확장
    'plugin:react/recommended', // React 권장 규칙
    'plugin:react-hooks/recommended', // React Hooks 권장 규칙
    'turbo', // Turborepo 규칙
  ],
  globals: {
    React: true, // React 전역 변수 인식
    JSX: true, // JSX 전역 변수 인식
  },
  env: {
    browser: true, // 브라우저 환경 활성화
  },
  plugins: [
    'react', // React 플러그인
    'react-hooks', // React Hooks 플러그인
  ],
  settings: {
    react: {
      version: 'detect', // 설치된 React 버전 자동 감지
    },
  },
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-key': 'warn',

    // React Hooks 규칙
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
