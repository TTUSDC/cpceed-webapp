import bunyan from 'bunyan';

// Checks current build environment
var envLevel = null;
switch(ENV) {
  case 'prod':
    envLevel = 'fatal';
    break;
  case 'dev':
    envLevel = 'debug';
    break;
  default:
    envLevel = 'debug';
}

var logger = bunyan.createLogger({
  name: 'CPCEED',
  stream: process.stdout,
  // Sets the logging level depending on build environment
  level: envLevel
});

export default logger;
