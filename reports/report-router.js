var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');
var reportModels = require('./report-models');
var reportManager = require('./report-manager');
var EventReport = reportModels.EventReport;
var OtherReport = reportModels.OtherReport;
var reportRouter = express.Router();

// TODO(jmtaber129): Consider separating callbacks for 'reportManager' methods between
// error and success cases.
reportRouter.post('/', (req, res) => {
  reportManager.createReport(req.body, {}, (err, savedReport) => {
    if (err) {
      // TODO(jmtaber129): Consider better error handling.
      res.status(400).send(err).end();
      return;
    }
    
    console.log({
      message: 'report created',
      id: savedReport.id,
    });
    
    res.status(201).location(savedReport.id).end();
  });
});

reportRouter.get('/', (req, res) => {
  reportManager.getAllReports(req.body, {}, (err, reports) => {
    if (err) {
      // TODO(jmtaber129): Consider better error handling.
      res.status(400).send(err).end();
      return;
    }
    
    res.json(reports);
  });
})

module.exports = { reportRouter };
