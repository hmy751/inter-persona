import type { Config } from 'jest';
import baseConfig from '@repo/testing-config/jest.config.base';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customConfig: Config = {
  ...baseConfig,
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    // ESM 패키지 모킹
    '^uuid$': '<rootDir>/src/_tests/_mocks/uuid.ts',
    '^react-error-boundary$': '<rootDir>/src/_tests/_mocks/react-error-boundary.tsx',

    '^@/_tests/(.*)$': '<rootDir>/src/_tests/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!(@repo/|msw|@tanstack))', '^.+\\.module\\.(css|sass|scss)$'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default createJestConfig(customConfig);
