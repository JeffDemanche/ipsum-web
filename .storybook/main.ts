import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-styling-webpack",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    const lessLoaderChain = {
      test: /\.less$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: {
              localIdentName: "[name]__[local]___[hash:base64:5]",
            },
          },
        },
        "less-loader",
      ],
    };
    // @ts-ignore
    const oneOfRule = config.module.rules.find((rule) => !!rule.oneOf);
    if (oneOfRule) {
      // @ts-ignore
      oneOfRule.oneOf.unshift(lessLoaderChain);
    } else {
      // @ts-ignore
      config.module.rules.unshift(lessLoaderChain);
    }

    return config;
  },
};
export default config;
