// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  ignorePatterns: ["**/__generated__/*"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "simple-import-sort"],
  rules: {
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "always"],
    "simple-import-sort/imports": "error",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-restricted-imports": 0,
    "@typescript-eslint/no-unused-vars": "warn",
    "react/prop-types": "off",
  },
  overrides: [
    {
      files: ["components/**/*", "util/**/*"],
      rules: {
        "@typescript-eslint/no-restricted-imports": [
          "error",
          {
            paths: ["components/*", "util/**/*"],
            patterns: [
              {
                group: [
                  "components/*/*/*",
                  "!components/atoms/*",
                  "!components/molecules/*",
                  "!components/organisms/*",
                ],
                message: "Don't reach into component packages",
              },
              {
                group: ["util/*/*", "styles/*/*"],
                message: "Don't reach into util or styles packages",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["**/__tests__/*", "*.stories.*"],
      rules: {
        "@typescript-eslint/no-restricted-imports": 0,
      },
    },
  ],
  settings: {
    "import/resolver": {
      typescript: {},
      webpack: {
        config: "./webpack.config.js",
      },
    },
  },
};
