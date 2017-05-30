const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const apiRouter = require('./api/server.js');
const cors = require('cors');
const logger = require('./common/logger');

// load environment variables from .env file.
dotenv.load({ path: process.env.ENV_PATH || '.env.default' });

// Express server.
const app = express();
app.use(cors());

// Express configuration.
const port = process.env.PORT || 3000;
app.set('port', port);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Connect to mongodb.
const mongoURL = process.env.MONGODB_URI || process.env.MONGOLAB_URI;
mongoose.Promise = global.Promise;
mongoose.connect(mongoURL);
mongoose.connection.on('error', (err) => {
  logger.fatal(err);
  logger.info('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit(1);
});

app.use('/', express.static(path.join(__dirname, '/build')));
app.use('/api', apiRouter);

// 404.
app.use((req, res, next) => {
  const err = new Error('Route not found.');

  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send(err);
});

// Start express server.
const server = app.listen(port, () => {
  logger.info('App is running at %d in %s mode', port, app.get('env'));
  logger.info('  Press ctrl-c to stop\n');
});

module.exports = server;
