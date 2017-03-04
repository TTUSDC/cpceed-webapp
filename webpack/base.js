const path = require('path');

const nodePath = path.resolve(__dirname, '../node_modules');
const appPath = path.resolve(__dirname, '../src');

const base = {
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
      files uses style-loader and css-loader.
    */
    rules: [
      {
        test: /\.js?$/,
        exclude: nodePath,
        loader: 'babel-loader'
      },
      {
        // 'test' indicates the file type
        test: /\.css$/,
        /*
          When there are multiple loaders, the ‘loader’ key is replaced by
          the ‘use’ key. Each member of the ‘use’ array is an object
          containing the ‘loader’ key and possibly the ‘options’ key. The
          ‘options’ key is used to specify query parameters.
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
              includePaths: nodePath
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
