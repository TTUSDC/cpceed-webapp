const winston = require('winston');

/**
 * Logging tool for API
 *
 * @typedef {function} - ApiLogger
 * @example
 * const logger = require('api/core/logger');
 * logger.trace('Message');
 * logger.debug('Message');
 * logger.info('Message');
 * logger.warn('Message');
 * logger.crit('Message');
 * logger.fatal('Message');
 */


// set default log level.
const logLevel = 'info';

// Set up logger
const customColors = {
  trace: 'white',
  debug: 'green',
  info: 'blue',
  warn: 'yellow',
  crit: 'red',
  fatal: 'red',
};

const logger = new (winston.Logger)({
  colors: customColors,
  level: logLevel,
  levels: {
    fatal: 0,
    crit: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      timestamp: false,
    }),
    new (winston.transports.File)({ filename: 'eoc.log' }),
  ],
});

winston.addColors(customColors);

// Extend logger object to properly log 'Error' types
const origLog = logger.log;

logger.log = (...args) => {
  if (args[1] instanceof Error) {
    const newArgs = args;
    newArgs[1] = args[1].stack;
    origLog.apply(logger, newArgs);
  } else {
    origLog.apply(logger, args);
  }
};

module.exports = logger;
