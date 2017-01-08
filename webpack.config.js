module.exports = {
    entry: './src/app/index.js',

    output: {
        path: 'src/client/',
        publicPath: '/',
        filename: "bundle.js"
    },

    devtool: 'source-map',

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
                    'style-loader',
                    'css-loader?modules&importLoaders=1&localIdentName=[path]__[name]__[local]__[hash:base64:5]',
                    'resolve-url-loader'
                ]
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style-loader',
                    'css-loader?modules&importLoaders=1&localIdentName=[path]__[name]__[local]__[hash:base64:5]',
                    'resolve-url-loader',
                    'sass-loader?sourceMap'
                ]
            }
        ]
    }
};
