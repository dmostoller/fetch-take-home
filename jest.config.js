export const testEnvironment = "jsdom";
export const setupFilesAfterEnv = ["<rootDir>/src/test/setupTests.ts"];
export const moduleNameMapper = {
  "^@/(.*)$": "<rootDir>/src/$1",
};
export const transform = {
  "^.+\\.(ts|tsx)$": "babel-jest",
  "^.+\\.mjs$": "babel-jest",
};
export const moduleFileExtensions = [
  "ts",
  "tsx",
  "js",
  "jsx",
  "json",
  "node",
  "mjs",
];
export const transformIgnorePatterns = ["node_modules/(?!(msw)/)"];
export const testPathIgnorePatterns = [
  "<rootDir>/node_modules/",
  "<rootDir>/.next/",
];
export const roots = ["<rootDir>/src"];
