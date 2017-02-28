var path = require('path');

var nodePath = path.join(__dirname, 'node_modules');
var appPath = path.join(__dirname, 'src');

module.exports = {
  entry: './src/index.js',

  output: {
    path: 'build/',
    publicPath: '/',
    filename: "bundle.js"
  },

  // Enables source maps that can be accessed in browser dev tools
  devtool: 'source-map',

  // Allows for absolute paths from locations indicated in 'root'
  resolve: {
    root: [
      nodePath,
      appPath
    ]
  },

  resolveLoader: {
    root: nodePath
  },

  module: {
    /*
      Loaders for specific file endings. Each one can be composed
      of multiple other loaders. For example, the loader for css
      files uses style-loader, css-loader, and resolve-url-loader.
    */
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        // 'test' indicates the file type
        test: /\.css$/,
        /*
          Each sub-loader is separated by a comma, queries are
          indicated by question marks, and individual parts of
          queries are separated by ampersands.
        */
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[path]__[name]__[local]__[hash:base64:5]'
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
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader?outputStyle=compressed'
        ]
      },
      {
        test: /\.(svg|png|jpg)$/,
        loader: 'file-loader'
      }
    ]
  },
  sassLoader: {
    includePaths: [
      './node_modules',
    ]
  }
};
