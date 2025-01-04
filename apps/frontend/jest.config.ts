import type { Config } from 'jest';
import baseConfig from "@repo/testing-config/jest.config.base";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});


const customConfig: Config = {
  ...baseConfig,
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "^.+\\.module\\.(css|sass|scss)$",
    /* 라이브러리 제거 예시 */
    "node_modules/(?!swiper)",
  ],
};

export default createJestConfig(customConfig);
