var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');
var reportModels = require('./report-models')
var EventReport = reportModels.EventReport;
var OtherReport = reportModels.OtherReport;
var reportRouter = express.Router();

// TODO(jmtaber129): Pull business logic into separate file.
reportRouter.post('/', (req, res) => {
  var otherReport = new OtherReport({
    type: 'event',
    approvalStatus: false,
    datetime: new Date()
  });

  otherReport.save(function(err, savedReport) {
    if (err)
      res.send(err);

    console.log({
      message: 'report created',
      id: savedReport.id
    });
    res.status(201).location(savedReport.id).end();
  });
    
});

reportRouter.get('/', (req, res) => {
  OtherReport.find({}, function(err, reports) {
    if (err) throw err;

    console.log(reports);
    res.json(reports);
  });
})

module.exports = { reportRouter };
