module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "/.(tsx|ts)?$/": "ts-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  modulePaths: ["<rootDir>/src"],
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  setupFiles: ["fake-indexeddb/auto"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.ts"],
};
