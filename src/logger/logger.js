import bunyan from 'bunyan';

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
  level: envLevel
});

export default logger;
