const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

const scriptConfig = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    "create-history-record-tables": "./scripts/database/create-history-record-tables.ts",
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "ts-loader",
        exclude: [/node_modules/, /webpack/],
        options: {
          configFile: "tsconfig.server.json",
        },
      },
      {
        test: /\.sql$/i,
        use: "raw-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".sql"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  target: "node",
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()],
};

const serverConfig = {
  mode: process.env.NODE_ENV || "development",
  entry: "./src/main.ts",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "ts-loader",
        exclude: [/node_modules/, /webpack/],
        options: {
          configFile: "tsconfig.server.json",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  target: "node",
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()],
};

module.exports = [serverConfig, scriptConfig];