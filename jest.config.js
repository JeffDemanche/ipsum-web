module.exports = {
  preset: "ts-jest",
  verbose: true,
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testEnvironment: "jsdom",
  transform: {
    "/.tests.(js|tsx|ts)?$/": "ts-jest",
  },
  testRegex: "(/__tests__/.*.tests)\\.[jt]sx?",
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$"],
  modulePaths: ["<rootDir>/src"],
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
    "^uuid$": require.resolve("uuid"),
  },
  setupFiles: ["fake-indexeddb/auto"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.ts"],
};
