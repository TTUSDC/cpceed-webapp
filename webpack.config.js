const prodApp = require('./webpack/prod-app.js');
const devApp = require('./webpack/dev-app.js');
const prodApi = require('./webpack/prod-api.js');
const devApi = require('./webpack/base-api.js');

function config(env) {
  let output = null;

  switch (env) {
    case 'prod-app':
      output = prodApp;
      break;
    case 'dev-app':
      output = devApp;
      break;
    case 'prod-api':
      output = prodApi;
      break;
    case 'dev-api':
      output = devApi;
      break;
    default:
      console.log('Error: unknown Webpack environment');
  }

  return output;
}

module.exports = config;
