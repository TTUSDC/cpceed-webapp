var prod = require('./webpack/prod.js');
var dev = require('./webpack/dev.js');
var test = require('./webpack/test.js');

function config(env) {
  switch(env) {
    case 'prod':
      return prod;
    case 'dev':
      return dev;
    case 'test':
      return test;
  }
}

module.exports = config;
