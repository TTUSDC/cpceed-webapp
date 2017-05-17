const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

// Routers.
const auth = require('./auth/auth-router.js');
const event = require('./events/router.js');
const report = require('./reports/report-router.js');
const user = require('./users/user-router.js');

// load environment variables from .env file.
dotenv.load({ path: process.env.ENV_PATH || '.env.default' });

// Express server.
const app = express();

// Express configuration.
const port = process.env.PORT || 3000;
app.set('port', port);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Connect to mongodb.
const mongoURL = process.env.MONGODB_URI || process.env.MONGOLAB_URI;
mongoose.Promise = global.Promise;
mongoose.connect(mongoURL);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

// App routes.
const router = express.Router();
router.use('/users', user.userRouter);
router.use('/events', event.eventRouter);
router.use('/reports', report.reportRouter);
router.use('/auth', auth.router);
app.use('/api', router);

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
  console.log('App is running at %d in %s mode', port, app.get('env'));
  console.log('  Press ctrl-c to stop\n');
});

module.exports = server;
