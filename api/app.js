const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const strings = require('api/resources/strings.js');
const passport = require('api/passport-config.js');
const apiRouter = require('api/router.js');
const logger = require('common/logger.js');

// Declarations/Definitions
const port = process.env.PORT || 3000;
const app = express();
const format = ':method :url :status :response-time ms - :res[content-length]';
const corsOptions = {};

// NODE_ENV dependent variations
switch (process.env.NODE_ENV) {
  case 'test':
    logger.disableAll();
    break;
  case 'dev':
    corsOptions.origin = 'http://127.0.0.1:8080';
    corsOptions.credentials = true;
    break;
  default:
    corsOptions.origin = 'http://127.0.0.1:3000';
}

// Express configuration.
app.use(cors(corsOptions));
app.set('port', port);
app.use(morgan(format, {
  skip() { return process.env.NODE_ENV === 'test'; },
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// TODO(NilsG-S): setup https for production
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === 'prod',
  },
  name: strings.cookieName,
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
app.use('/', express.static(`${__dirname}/../build`));
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

module.exports = app;
