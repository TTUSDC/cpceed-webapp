// BASE SETUP
var express = require('express');
var bodyParser = require('body-parser');
var user = require('./Users/router.js');
var event = require('./Events/router.js');
var report = require('./Reports/router.js');
var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// BASE ROUTES
var router = express.Router();
router.use('/users', user.userRouter);
router.use('/events', event.eventRouter);
router.use('/reports', report.reportRouter);

app.use('/api', router);

app.listen(port);
console.log('Listening on port ' + port);