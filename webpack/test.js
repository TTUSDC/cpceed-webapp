const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const base = require('./base.js');

const test = webpackMerge(base, {
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
