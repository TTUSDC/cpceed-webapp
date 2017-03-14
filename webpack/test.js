const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');

const base = require('./base.js');

const buildPath = path.resolve(__dirname, '../build');

const test = webpackMerge(base, {
  output: {
    path: buildPath,
    publicPath: '/',
    filename: "test.bundle.js"
  },

  entry: './test/index.js',

  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },

  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('test')
    })
  ]
});

module.exports = test;
