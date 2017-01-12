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
                    "Since Sass/libsass does not provide url rewriting, all
                    linked assets must be relative to the output."
                    - https://github.com/jtangelder/sass-loader

                    Typically, one needs to use resolve-url-loader in order
                    to reference assets via paths relative to the source scss
                    file, however I have been able to do so without it.

                    If it turns out that resolve-url-loader is required at
                    some point in the future, note that there is, as of the
                    writing of this documentation, an ongoing issue around
                    the use of css-loader with the sourceMap option enabled
                    and file-loader. resolve-url-loader requires that
                    sourceMap be enabled on the sass-loader, so this might
                    not be applicable to the css-loader issue, but the link
                    to the relvant webpage is below just-in-case.

                    https://github.com/webpack/style-loader/issues/55
                */
                test: /\.scss$/,
                loaders: [
                    'style-loader',
                    'css-loader?modules&importLoaders=1&localIdentName=[path]__[name]__[local]__[hash:base64:5]',
                    'sass-loader'
                ]
            },
            {
                test: /\.(svg|png|jpg)$/,
                loader: 'file-loader'
            }
        ]
    }
};
