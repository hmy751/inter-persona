import { getTestingConfigPath } from "./util";

const baseConfig = {
  verbose: true,
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(css|less|scss|sass)\\?modules$": "identity-obj-proxy",

    // testing-config 경로 수정
    "^.+\\.(css|sass|scss)$": getTestingConfigPath("mocks/styleMock.js"),
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": getTestingConfigPath("mocks/fileMock.js"),
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      getTestingConfigPath("jest.transform.base.ts"),
  },
  testEnvironment: "jest-environment-jsdom",
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  setupFilesAfterEnv: [
    getTestingConfigPath("jest.setup.base.ts")
  ],
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
};

export default baseConfig;