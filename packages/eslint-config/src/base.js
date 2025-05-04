/** @type {import("eslint").Linter.Config} */

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // TypeScript 권장 규칙
    'prettier', // Prettier 규칙과 충돌하는 ESLint 규칙 비활성화 (반드시 마지막에 추가)
  ],
  parser: '@typescript-eslint/parser', // TypeScript 파서 사용
  plugins: [
    '@typescript-eslint',
    'import', // import/export 문법 관련 규칙 (옵션)
    'prettier', // Prettier 규칙을 ESLint 규칙으로 실행
  ],
  env: {
    es2022: true, // 최신 ECMAScript 기능 지원
    node: true, // Node.js 환경 기본 지원
  },
  ignorePatterns: [
    // 공통 무시 패턴
    'node_modules/',
    'dist/',
    '.turbo/',
    '.*.js',
    '*.config.js',
    '*.config.ts',
  ],
  rules: {
    // Prettier 규칙 위반 시 에러 표시
    'prettier/prettier': 'error',

    // 기본적인 코드 품질 규칙
    'prefer-const': 'error', // 재할당 없는 변수는 const 사용 권장
    'no-var': 'error', // var 사용 금지
    eqeqeq: ['error', 'always', { null: 'ignore' }], // === 사용 강제 (null 제외)
    'no-console': ['warn', { allow: ['warn', 'error'] }], // console.log 사용 시 경고 (warn, error 제외)
    curly: ['error', 'all'], // if, for 등에 중괄호 사용 강제

    // TypeScript 관련 규칙 (recommended에서 일부 활성화됨, 필요시 재정의)
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }, // 사용 안 한 변수 경고 (_ 시작 시 무시)
    ],
    '@typescript-eslint/no-explicit-any': 'warn', // 'any' 타입 사용 시 경고
    '@typescript-eslint/explicit-function-return-type': 'off', // 함수 반환 타입 명시 강제 안 함
    '@typescript-eslint/no-non-null-assertion': 'warn', // non-null assertion 사용 시 경고
    '@typescript-eslint/no-empty-function': 'off', // 빈 함수 허용

    // Import 관련 규칙
    'import/no-duplicates': 'error', // 중복 import 금지

    // Prettier가 처리하므로 ESLint 자체 포맷팅 규칙은 비활성화
    indent: 'off',
    semi: 'off',
    quotes: 'off',
    'comma-dangle': 'off',

    // 기타 (기존 설정 유지)
    'no-undef': 'off',
  },
};
