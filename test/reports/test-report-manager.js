var mockgoose = require('mockgoose');
var mongoose = require('mongoose');
var assert = require('assert');
mockgoose(mongoose);

var reportManager = require('../../src/reports/report-manager');
var reportModels = require('../../src/reports/report-models');
var Report = reportModels.Report;
var EventReport = reportModels.EventReport;
var OtherReport = reportModels.OtherReport;

describe('reportManager', () => {
  before((done) => { mongoose.connect('', done); });
  beforeEach((done) => {
    mockgoose.reset();
    done();
  });

  after((done) => { mongoose.unmock(done); });

  describe('#createReport', () => {

    it('should pass a created event report to the callback', (done) => {
      var eventReport = {
        type: 'event',
        approvalStatus: true,
        student: 'John Doe',
        event: 'someEventUid',
      };
      reportManager.createReport(eventReport, {}, (err, createdReport) => {
        assert.equal(err, null);
        assert.equal(createdReport.type, 'EventReport');
        assert.equal(createdReport.approvalStatus, false);
        assert.equal(createdReport.student, eventReport.student);
        assert.equal(createdReport.event, eventReport.event);

        Report.findById(createdReport.id, (err, report) => {
          assert.equal(report.type, 'EventReport');
          assert.equal(report.approvalStatus, false);
          assert.equal(report.student, eventReport.student);
          assert.equal(report.event, eventReport.event);
          done();
        });

      });
    });

    it('should pass a created other report to the callback', (done) => {
      var otherReport = {
        type: 'other',
        approvalStatus: true,
        student: 'John Doe',
        category: 'Some category',
        datetime: 'Apr 04 2017',
        location: 'EC203',
        description: 'Some report description',
      };
      reportManager.createReport(otherReport, {}, (err, createdReport) => {
        assert.equal(err, null);
        assert.equal(createdReport.type, 'OtherReport');
        assert.equal(createdReport.approvalStatus, false);
        assert.equal(createdReport.student, otherReport.student);
        assert.equal(createdReport.category, otherReport.category);
        assert.equal(
            new Date(createdReport.datetime).getTime(),
            new Date(otherReport.datetime).getTime());
        assert.equal(createdReport.location, otherReport.location);
        assert.equal(createdReport.description, otherReport.description);

        Report.findById(createdReport.id, (err, report) => {
          assert.equal(err, null);
          assert.equal(createdReport.type, 'OtherReport');
          assert.equal(createdReport.approvalStatus, false);
          assert.equal(createdReport.student, otherReport.student);
          assert.equal(createdReport.category, otherReport.category);
          assert.equal(
              new Date(createdReport.datetime).getTime(),
              new Date('Apr 04 2017').getTime());
          assert.equal(createdReport.location, otherReport.location);
          assert.equal(createdReport.description, otherReport.description);
          done();
        });
      });
    });
  });

  describe('#modifyReport', () => {
    it('should modify the event report', (done) => {
      var originalEventReport = new EventReport({
        student: 'John Doe',
        event: 'someEventUid',
      });
      var updatedEventReport = {
        student: 'Jane Doe',
        approvalStatus: true,
      };
      originalEventReport.save((err, createdReport) => {
        assert.equal(err, null);
        reportManager.modifyReport(
            createdReport.id, updatedEventReport, {}, (err, updatedReport) => {
              assert.equal(err, null);
              assert.equal(updatedReport.type, 'EventReport');
              assert.equal(updatedReport.student, updatedEventReport.student);
              assert.equal(
                  updatedReport.approvalStatus,
                  updatedEventReport.approvalStatus);
              assert.equal(updatedReport.event, originalEventReport.event);
              done();
            });
      });
    });

    it('should modify the other report', (done) => {
      var originalOtherReport = new OtherReport({
        student: 'John Doe',
        category: 'Some category',
        datetime: 'Apr 04 2017',
        location: 'EC203',
        description: 'Some report description',
      });
      var updatedOtherReport = {
        student: 'Jane Doe',
        approvalStatus: true,
        location: 'EC204',
      };
      originalOtherReport.save((err, createdReport) => {
        assert.equal(err, null);
        reportManager.modifyReport(
            createdReport.id, updatedOtherReport, {}, (err, updatedReport) => {
              assert.equal(err, null);
              assert.equal(updatedReport.type, 'OtherReport');
              assert.equal(updatedReport.student, updatedOtherReport.student);
              assert.equal(
                  updatedReport.approvalStatus,
                  updatedOtherReport.approvalStatus);
              assert.equal(
                  updatedReport.category, originalOtherReport.category);
              assert.equal(
                  new Date(updatedReport.datetime).getTime(),
                  new Date(originalOtherReport.datetime).getTime());
              assert.equal(updatedReport.location, updatedOtherReport.location);
              assert.equal(
                  updatedReport.description, originalOtherReport.description);
              done();
            });
      });
    });
  });

  describe('#deleteReport', () => {
    it('should delete the report', (done) => {
      var report = new EventReport({
        student: 'John Doe',
        event: 'someEventUid',
      });
      report.save((err, createdReport) => {
        assert.equal(err, null);
        reportManager.deleteReport(
            createdReport.id, {}, (err, deletedReport) => {
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
        reportManager.getReportById(
            createdReport.id, {}, (err, foundReport) => {
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
          });
        });
      });
    });
  });

});