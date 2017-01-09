var path = require('path');

var nodePath = path.join(__dirname, 'node_modules');
var appPath = path.join(__dirname, 'src/app');

module.exports = {
    entry: './src/app/index.js',

    output: {
        path: 'src/client/',
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
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader?modules&importLoaders=1&localIdentName=[path]__[name]__[local]__[hash:base64:5]',
                    'resolve-url-loader'
                ]
            },
            {
                // 'test' indicates the file type
                test: /\.scss$/,
                /*
                    Each sub-loader is separated by '!', queries are
                    indicated by '?', and individual parts of queries are
                    separated by '&'
                */
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
