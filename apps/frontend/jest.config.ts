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
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!(@repo/|uuid|react-error-boundary|msw|@tanstack))', '^.+\\.module\\.(css|sass|scss)$'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default createJestConfig(customConfig);
