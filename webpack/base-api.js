const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

const nodePath = path.resolve(__dirname, '../node_modules');
const commonPath = path.resolve(__dirname, '../common');

const externals = {};
fs.readdirSync(nodePath).filter(file => file !== '.bin')
  .forEach((file) => {
    externals[file] = `commonjs ${file}`;
  });

const baseApi = {
  target: 'node',

  // Allows for absolute paths from locations indicated in 'modules'
  resolve: {
    modules: [
      commonPath,
    ],
  },

  externals,

  // Enables source maps
  devtool: 'source-map',

  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
  ],
};

module.exports = baseApi;
