const path = require('path');
const webpack = require('webpack');
const WebpackWatchPlugin = require('./webpack-watch-plugin.js');
const fs = require('fs');

const nodePath = path.resolve(__dirname, '../node_modules');
const commonPath = path.resolve(__dirname, '../common');
const buildPath = path.resolve(__dirname, '../build');

const externals = {};
fs.readdirSync(nodePath).filter((file) => {
  return file !== '.bin';
}).forEach((file) => {
  externals[file] = `commonjs ${file}`;
});

const baseApi = {
  entry: './server.js',

  output: {
    path: buildPath,
    filename: 'api.bundle.js',
  },

  target: 'node',

  // Allows for absolute paths from locations indicated in 'modules'
  resolve: {
    modules: [
      commonPath,
    ],
  },

  externals: externals,

  // Enables source maps
  devtool: 'source-map',

  watch: true,

  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('dev'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
    new WebpackWatchPlugin(),
  ],
};

module.exports = baseApi;
