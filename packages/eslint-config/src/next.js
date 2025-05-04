/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    './base.js', // 중앙 설정 확장
    'plugin:react/recommended', // React 권장 규칙
    'plugin:react-hooks/recommended', // React Hooks 권장 규칙
    require.resolve('@vercel/style-guide/eslint/next'), // Vercel Next.js 스타일 가이드
    'turbo', // Turborepo 규칙
  ],
  globals: {
    React: true, // React 전역 변수 인식
    JSX: true, // JSX 전역 변수 인식
  },
  env: {
    node: true,
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
  ignorePatterns: ['.next/'],
  rules: {
    'react/jsx-key': 'warn', // 반복문에서 key prop 누락 시 경고
    'react-hooks/rules-of-hooks': 'error', // React Hooks 규칙 (recommended 에서 활성화되지만 명시적으로 확인)
    'react-hooks/exhaustive-deps': 'warn', // 의존성 배열 체크 (경고 수준)
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      env: {
        jest: true,
      },
    },
  ],
};
