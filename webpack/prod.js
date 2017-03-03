const webpackMerge = require('webpack-merge');

const base = require('./base.js');

const prod = webpackMerge(base, {
  entry: './src/index.js'
});

module.exports = prod;
