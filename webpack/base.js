const path = require('path');

const nodePath = path.resolve(__dirname, '../node_modules');
const appPath = path.resolve(__dirname, '../src');
const buildPath = path.resolve(__dirname, '../build');

const base = {
  output: {
    path: buildPath,
    publicPath: '/',
    filename: "bundle.js"
  },

  // Allows for absolute paths from locations indicated in 'root'
  resolve: {
    modules: [
      nodePath,
      appPath
    ]
  },

  module: {
    /*
      Loaders for specific file endings. Each one can be composed
      of multiple other loaders. For example, the loader for css
      files uses style-loader, css-loader, and resolve-url-loader.
    */
    rules: [
      {
        test: /\.js?$/,
        exclude: 'node_modules',
        loader: 'babel-loader'
      },
      {
        // 'test' indicates the file type
        test: /\.css$/,
        /*
          Each sub-loader is separated by a comma, queries are
          indicated by question marks, and individual parts of
          queries are separated by ampersands.
        */
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[path]__[name]__[local]__[hash:base64:5]'
            }
          }
        ]
      },
      {
        /*
          sass-loader is only used to allow customization of
          grommet. The two main types of customization are:
            - Overriding variables
            - Creating a custom theme

          We are primarily concerned with the second option as of
          writing of this documentation.
        */
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'compressed',
              includePaths: 'node_modules'
            }
          }
        ]
      },
      {
        test: /\.(svg|png|jpg)$/,
        loader: 'file-loader'
      }
    ]
  }
};

module.exports = base;
