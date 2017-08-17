require('app-module-path').addPath(__dirname);
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('api/passport-config.js');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRouter = require('api/server');
const logger = require('api/core/logger');

// load environment variables from .env file.
dotenv.load({ path: process.env.ENV_PATH || '.env.default' });

// Definitions
const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGODB_URI || process.env.MONGOLAB_URI;
const app = express();
let service;

/**
 * Performs all start up operations such as connectiong to the database
 * and listening at the port.
 *
 * @param {function} cb - Called when started.
 * @returns {http.Server|*} - The HTTP Server listening
 */
const start = (cb) => {
  // Connect to mongodb.
  mongoose.Promise = global.Promise;
  mongoose.connection.on('error', (err) => {
    logger.fatal(err);
    logger.info('MongoDB connection error. Please make sure MongoDB is running.');
    process.exit(1);
  });
  mongoose.connect(mongoURL);

  // Express configuration.
  app.use(cors());
  app.set('port', port);
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // TODO(NilsG-S): setup https for production
  app.use(session({
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14,
      secure: process.env.NODE_ENV === 'production',
    },
    name: 'cpceed.sid',
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24 * 14,
      collection: 'sessions',
      stringify: false,
    }),
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Routes.
  app.use('/', express.static(`${__dirname}/build`));
  app.use('/api', apiRouter);

  // 404.
  app.use((req, res, next) => {
    const err = new Error('Route not found.');

    err.status = 404;
    next(err);
  });

  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json(err.message);
  });

  service = app.listen(port, cb);
  return service;
};

/**
 * The reverse of {@link start}
 *
 * @param {function} cb - Called when stopped
 */
const stop = (cb) => {
  mongoose.disconnect();
  service.close(cb);
};

const server = { start, stop };

if (require.main === module) {
  start(() => {
    logger.info(`App is running at ${port} in ${app.get('env')} mode\n  Press ctrl-c to stop\n`);
  });
}
module.exports = server;
