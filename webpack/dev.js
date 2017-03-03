const webpackMerge = require('webpack-merge');

const base = require('./base.js');

const dev = webpackMerge(base, {
  entry: './src/index.js',

  // Enables source maps that can be accessed in browser dev tools
  devtool: 'source-map',
});

module.exports = dev;
