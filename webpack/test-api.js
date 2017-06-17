const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');

const baseApi = require('./base-api.js');

const buildPath = path.resolve(__dirname, '../build');

const testApi = webpackMerge(baseApi, {
  entry: './test/api/index.js',

  output: {
    path: buildPath,
    filename: 'test.api.bundle.js',
  },

  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('testApi'),
    }),
  ],
});

module.exports = testApi;
