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

reportRouter.delete('/:uid', (req, res) => {
  reportManager.deleteReport(req.params.uid, {}, (err, report) => {
    if (err) {
      // TODO(jmtaber129): Consider better error handling.
      res.status(400).send(err).end();
      return;
    }
    
    res.status(204).end();
  });
});

reportRouter.get('/:uid', (req, res) => {
  reportManager.getReportById(req.params.uid, {}, (err, report) => {
    if (err) {
      // TODO(jmtaber129): Consider better error handling.
      res.status(400).send(err).end();
      return;
    }
    
    if (!report) {
      // Report was not found.
      // TODO(jmtaber129): Add error handling for when a user is not authorized to view
      // the report.
      res.status(404).end();
      return;
    }
    
    res.json(report);
  });
});

reportRouter.get('/', (req, res) => {
  reportManager.getAllReports(req.params, {}, (err, reports) => {
    if (err) {
      // TODO(jmtaber129): Consider better error handling.
      res.status(400).send(err).end();
      return;
    }
    
    res.json(reports);
  });
});

module.exports = { reportRouter };
