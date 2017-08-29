const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const passport = require('api/passport-config.js');
const apiRouter = require('api/router.js');

// Declarations/Definitions
const port = process.env.PORT || 3000;
const app = express();

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
    secure: process.env.NODE_ENV === 'prod',
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

module.exports = app;
