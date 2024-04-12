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
  ],
  parser: "@typescript-eslint/parser",
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
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "components/*/*",
              "!components/atoms/*",
              "!components/molecules/*",
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
  overrides: [
    {
      files: ["**/__tests__/*"],
      rules: {
        "@typescript-eslint/no-restricted-imports": 0,
      },
    },
  ],
  settings: {
    "import/resolver": {
      webpack: {
        config: "./webpack.config.js",
      },
    },
  },
};
