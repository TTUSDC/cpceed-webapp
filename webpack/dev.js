const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');

const base = require('./base.js');

const buildPath = path.resolve(__dirname, '../build');

const dev = webpackMerge(base, {
  output: {
    path: buildPath,
    publicPath: '/',
    filename: "bundle.js"
  },

  entry: './src/index.js',

  // Enables source maps that can be accessed in browser dev tools
  devtool: 'source-map',

  devServer: {
    port: 8080,
    host: '0.0.0.0',
    inline: true,
    contentBase: buildPath
  },

  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('dev')
    })
  ]
});

module.exports = dev;
