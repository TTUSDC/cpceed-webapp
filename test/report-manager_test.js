var mockgoose = require('mockgoose');
var mongoose = require('mongoose');
var assert = require('assert');
mockgoose(mongoose);

var reportManager = require('../reports/report-manager');
var reportModels = require('../reports/report-models');
var Report = reportModels.Report;
var EventReport = reportModels.EventReport;
var OtherReport = reportModels.OtherReport;

describe('reportManager', () => {
  beforeEach( (done) => {
    mongoose.connect('', () => {
      mockgoose.reset();
      done();
    });
  });
  
  describe('#createReport', () => {
    
    it('should call the callback with a created event report with correct fields and store report in DB', (done) => {
      var eventReport = {
        type: 'event',
        student: 'John Doe',
        event: 'someEventUid',
      };
      reportManager.createReport(eventReport, {}, (err, createdReport) => {
        assert.equal(err, null);
        assert.equal(createdReport.type, 'EventReport');
        assert.equal(createdReport.student, 'John Doe');
        assert.equal(createdReport.event, 'someEventUid');
        assert.equal(createdReport.approvalStatus, false);
        
        Report.findById(createdReport.id, (err, report) => {
          assert.equal(err, null);
          assert.equal(report.type, 'EventReport');
          assert.equal(report.student, 'John Doe');
          assert.equal(report.event, 'someEventUid');
          assert.equal(report.approvalStatus, false);
          done();
        });
        
      });
    });

    it('should call the callback with an invalid type error', (done) => {
      var report = {
        type: 'invalidType',
        student: 'John Doe',
      };
      
      reportManager.createReport(report, {}, (err, createdReport) => {
        assert.equal(err.message, 'Invalid report type.');
        done();
      });
    });
  });
  
  describe('#modifyReport', () => {
    it('should modify the report', (done) => {
      var originalReport = new EventReport({
        student: 'John Doe',
        event: 'someEventUid',
      });
      var updatedReportObject = {
        student: 'Jane Doe',
        approvalStatus: true,
      };
      originalReport.save((err, createdReport) => {
        assert.equal(err, null);
        reportManager.modifyReport(createdReport.id, updatedReportObject, {}, (err, updatedReport) => {
          assert.equal(err, null);
          done();
        });
      });
    })
  });
  
  describe('#deleteReport', () => {
    it('should delete the report', (done) => {
      var report = new EventReport({
        student: 'John Doe',
        event: 'someEventUid',
      });
      report.save((err, createdReport) => {
        assert.equal(err, null);
        reportManager.deleteReport(createdReport.id, {}, (err, deletedReport) => {
          assert.equal(err, null);
          done();
        });
      });
    });
  });
  
  describe('#getReportById', () => {
    it('should call the callback with the report with the given id', (done) => {
      var report = new EventReport({
        student: 'John Doe',
        event: 'someEventUid',
      });
      report.save((err, createdReport) => {
        assert.equal(err, null);
        reportManager.getReportById(createdReport.id, {}, (err, foundReport) => {
          assert.equal(err, null);
          done();
        });
      });
    });
  });
  
  describe('#getAllReports', () => {
    it('should return all reports', (done) => {
      var report1 = new EventReport({
        student: 'John Doe',
        event: 'someEventUid',
      });
      var report2 = new OtherReport({
        student: 'Jane Doe',
        title: 'Some report',
      });
      report1.save((err) => {
        assert.equal(err, null);
        report2.save((err) => {
          assert.equal(err, null);
          reportManager.getAllReports({}, {}, (err, reports) => {
            assert.equal(err);
            done();
          })
        });
      });
    })
  });
  
});