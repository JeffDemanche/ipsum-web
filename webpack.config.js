/* eslint-disable no-undef */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env) => ({
  entry: "./src/index.tsx",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
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
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(graphql|gql)$/,
        loader: "graphql-tag/loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      util: path.resolve(__dirname, "src/util"),
      components: path.resolve(__dirname, "src/components"),
      views: path.resolve(__dirname, "src/views"),
      state: path.resolve(__dirname, "src/state"),
      styles: path.resolve(__dirname, "src/styles"),
      mocks: path.resolve(__dirname, "src/mocks"),
    },
    fallback: {
      fs: false,
      path: false,
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/src/assets/index.html",
      filename: "index.html",
      favicon: __dirname + "/src/assets/favicon.svg",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/assets",
          filter: (resourcePath) => !resourcePath.includes("index.html"),
        },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    watchFiles: "./src",
    historyApiFallback: true,
    compress: true,
    port: 9000,
  },
});
