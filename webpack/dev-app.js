const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');

const base = require('./base-app.js');

const buildPath = path.resolve(__dirname, '../build');

const dev = webpackMerge(base, {
  output: {
    path: buildPath,
    publicPath: '/',
    filename: 'bundle.js',
  },

  entry: './src/index.jsx',

  // Enables source maps that can be accessed in browser dev tools
  devtool: 'cheap-module-eval-source-map',

  devServer: {
    port: 8080,
    host: '0.0.0.0',
    inline: true,
    contentBase: buildPath,
  },

  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('devApp'),
    }),
  ],
});

module.exports = dev;
