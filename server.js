const express = require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const apiRouter = require('./api/server.js');
const cors = require('cors');

// load environment variables from .env file.
dotenv.load({ path: process.env.ENV_PATH || '.env.default' });

// Express server.
const app = express();
app.use(cors());

// Express configuration.
const port = process.env.PORT || 3000;
app.set('port', port);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to mongodb.
const mongoURL = process.env.MONGODB_URI || process.env.MONGOLAB_URI;
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit(1);
});

app.use('/', express.static(`${__dirname}/build`));
app.use('/api', apiRouter);

// 404.
app.use((req, res, next) => {
  const err = new Error('Route not found.');

  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json(err.message);
});

let service;

/**
 * Performs all start up operations such as connectiong to the database
 * and listening at the port.
 *
 * @param {function} cb - Called when started.
 * @returns {http.Server|*} - The HTTP Server listening
 */
const start = (cb) => {
  mongoose.connect(mongoURL);
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
}

const server = { start, stop };

if (require.main === module) {
  start(() => {
    console.log('App is running at %d in %s mode', port, app.get('env'));
    console.log('  Press ctrl-c to stop\n');
  });
}
module.exports = server;
