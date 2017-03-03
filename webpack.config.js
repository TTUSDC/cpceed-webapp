var production = require('./webpack/production');
var dev = require('./webpack/dev');
var test = require('./webpack/test');

function config() {
  switch(process.env.NODE_ENV) {
    case 'production':
      return production;
    case 'dev':
      return dev;
    case 'test':
      return test;
  }
};

module.exports = config;
