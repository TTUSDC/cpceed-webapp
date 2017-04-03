var webpackConfig = require('./webpack/test.js');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      'test/index.js'
    ],

    // preprocess matching files before serving them to the browser
    preprocessors: {
      'test/index.js': ['webpack']
    },

    webpack: webpackConfig,

    // test results reporter to use
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
    logLevel: config.LOG_INFO,
   
    // Doesn't block logger from appearing in console 
    client: {
      captureConsole: true,
    },

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    browsers: ['Firefox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
