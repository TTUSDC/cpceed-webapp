var prod = require('./webpack/prod.js');
var dev = require('./webpack/dev.js');

function config(env) {
  switch(env) {
    case 'prod':
      return prod;
    case 'dev':
      return dev;
  }
}

module.exports = config;
