const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');

const baseApi = require('./base-api.js');

const buildPath = path.resolve(__dirname, '../build');

const devApi = webpackMerge(baseApi, {
  entry: './server.js',

  output: {
    path: buildPath,
    filename: 'api.bundle.js',
  },

  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('prodApi'),
    }),
  ],
});

module.exports = devApi;
