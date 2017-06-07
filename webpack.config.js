const prodApp = require('./webpack/prod.js');
const devApp = require('./webpack/dev.js');
const devApi = require('./webpack/base-api.js');

function config(env) {
  switch(env) {
    case 'prod-app':
      return prodApp;
    case 'dev-app':
      return devApp;
    case 'dev-api':
      return devApi;
  }
}

module.exports = config;
