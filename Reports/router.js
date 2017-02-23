var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');
var reportModels = require('./reportModels')
var EventReport = reportModels.EventReport;
var OtherReport = reportModels.OtherReport;
var reportRouter = express.Router();

reportRouter.post('/', (req, res) => {
    var eventReport = new EventReport({
        type: 'event',
        approvalStatus: 'notApproved'
    });
    
    eventReport.save(function(err, savedReport) {
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
    var Report = mongoose.model('EventReport');
    Report.find({}, function(err, reports) {
        if (err) throw err;
        
        console.log(reports);
        res.json(reports);
    });
})

module.exports = { reportRouter };
