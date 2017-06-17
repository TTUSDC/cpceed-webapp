const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');

const WebpackWatchPlugin = require('./webpack-watch-plugin.js');
const baseApi = require('./base-api.js');

const buildPath = path.resolve(__dirname, '../build');

const devApi = webpackMerge(baseApi, {
  entry: './server.js',

  output: {
    path: buildPath,
    filename: 'api.bundle.js',
  },

  watch: true,

  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('devApi'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackWatchPlugin(),
  ],
});

module.exports = devApi;
