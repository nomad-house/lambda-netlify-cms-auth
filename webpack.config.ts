require("dotenv").config();
import { Configuration } from "webpack";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import { resolve } from "path";

const PROD = process.env.NODE_ENV === "production";

const _config: Configuration = {
  mode: PROD ? "production" : "development",
  target: "node",
  entry: {
    authUri: resolve(__dirname, "src", "authUri.ts"),
    authCallback: resolve(__dirname, "src", "authCallback.ts"),
    authSuccess: resolve(__dirname, "src", "authSuccess.ts"),
  },
  output: {
    filename: "[name].js",
    libraryTarget: "commonjs",
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".js", ".json"],
  },
  externals: ["aws-sdk"],
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              configFile: resolve(__dirname, "tsconfig.webpack.json"),
            },
          },
        ],
      },
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "shebang-loader",
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
};

if (PROD) {
  _config.devtool = "eval-source-map";
}

export default _config;
