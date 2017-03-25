// BASE SETUP
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');

/** router **/
const user = require('./Users/router.js');
const event = require('./Events/router.js');
const report = require('./reports/report-router.js');
const auth = require('./auth/auth-router.js');

/** load environment variables from .env file **/
dotenv.load({ path: '.env.example' });

/** express server **/
const app = express();

/** connect to mongodb **/
const mongoURL = process.env.MONGODB_URI || process.env.MONGOLAB_URI
mongoose.Promise = global.Promise;
mongoose.connect(mongoURL);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

/** express configuration **/
const port = process.env.PORT || 3000;
app.set('port', port);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

/** app routes **/
const router = express.Router();
router.use('/users', user.userRouter);
router.use('/events', event.eventRouter);
router.use('/reports', report.reportRouter);
router.use('/auth', auth.router);

//app.use(auth.verify);
app.use('/api', router);

/** start express server **/
app.listen(port, () => {
  console.log('App is running at %d in %s mode', port, app.get('env'));
  console.log('  Press ctrl-c to stop\n');
});

module.exports = app;
