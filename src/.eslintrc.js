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
  plugins: ["react", "@typescript-eslint"],
  rules: {
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "always"],
    "@typescript-eslint/no-empty-function": "off",
    "import/no-internal-modules": [
      "error",
      {
        forbid: ["components/**/*", "state/**/*", "util/**/*"],
      },
    ],
  },
  overrides: [
    {
      files: ["**/__tests__/*"],
      rules: {
        "import/no-internal-modules": 0,
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
