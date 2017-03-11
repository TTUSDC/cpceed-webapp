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

  entry: './test/index.js'
});

module.exports = test;
