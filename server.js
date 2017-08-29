require('app-module-path').addPath(__dirname);
// load environment variables from .env file.
require('dotenv').load({ path: process.env.ENV_PATH || '.env.default' });

const logger = require('api/core/logger.js');
const connection = require('api/connection.js');
const app = require('api/app.js');

// Declarations/Definitions
const port = process.env.PORT || 3000;

connection.open()
  .then(() => {
    app.listen(port, () => {
      logger.info(`App is running at ${port} in ${app.get('env')} mode\n  Press ctrl-c to stop\n`);
    });
  })
  .catch((err) => {
    logger.fatal(err);
    logger.info('MongoDB connection error. Please make sure MongoDB is running.');
    process.exit(1);
  });
