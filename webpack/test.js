const webpackMerge = require('webpack-merge');

const base = require('./base.js');

const test = webpackMerge(base, {
  entry: './test/index.js'
});

module.exports = test;
