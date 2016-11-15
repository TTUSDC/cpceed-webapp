module.exports = {
  entry: './src/app/index.js',

  output: {
      path: 'src/client/',
      publicPath: '/',
      filename: "bundle.js"
  },

  module: {
    loaders: [
    {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel'
    },
    {
        test: /\.css$/,
        loaders: [
            'style?sourceMap',
            'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        ]
    },
    {
        test: /\.scss$/,
        loaders: [
            'style?sourceMap',
            'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
            'resolve-url',
            'sass?sourceMap'
        ]
    }
    ]
  }
};
