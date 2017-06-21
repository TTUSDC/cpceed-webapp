const express = require('express');
const logger = require('common/logger.js');

// Routers.
const auth = require('./auth/auth-router.js');
const events = require('./events/event-router.js');
const report = require('./reports/report-router.js');
const user = require('./users/user-router.js');


// App routes.
const router = express.Router();
router.use('/users', user.userRouter);
router.use('/events', events.eventRouter);
router.use('/reports', report.reportRouter);
router.use('/auth', auth.router);

if (process.env.LOGSUPRESS) logger.disableAll();

module.exports = router;
