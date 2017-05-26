const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express'); //saved
const logger = require('morgan');
const mongoose = require('mongoose');


// Routers.
const auth = require('./auth/auth-router.js');
//const event = require('./events/router.js');
const report = require('./reports/report-router.js');
const user = require('./users/user-router.js');


// App routes.
const router = express.Router();
router.use('/users', user.userRouter);
//router.use('/events', event.eventRouter);
router.use('/reports', report.reportRouter);
router.use('/auth', auth.router);


module.exports = router;
