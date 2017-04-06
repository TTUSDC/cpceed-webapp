const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const assert = require('assert');
mockgoose(mongoose);

const reportManager = require('../../src/reports/report-manager');
const reportModels = require('../../src/reports/report-models');
const Report = reportModels.Report;
const EventReport = reportModels.EventReport;
const OtherReport = reportModels.OtherReport;

describe('reportManager', () => {
  // Mockgoose doesn't start the mock until after 'mongoose.connect()' is
  // called.
  // TODO(jmtaber129): Find a version of mockgoose that works and doesn't
  // print to console each time 'mongoose.connect()' is called.
  before((done) => { mongoose.connect('', done); });
  
  // Clear out the mocked database before each test case.
  beforeEach((done) => {
    mockgoose.reset();
    done();
  });

  after((done) => { mongoose.unmock(done); });

  describe('#createReport', () => {

    it('should pass a created event report to the callback', (done) => {
      const eventReport = {
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

        Report.findById(createdReport.id, (err, foundReport) => {
          assert.equal(err, null);
          assert.equal(foundReport.type, 'EventReport');
          assert.equal(foundReport.approvalStatus, false);
          assert.equal(foundReport.student, eventReport.student);
          assert.equal(foundReport.event, eventReport.event);
          done();
        });

      });
    });

    it('should pass a created other report to the callback', (done) => {
      const otherReport = {
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

        Report.findById(createdReport.id, (err, foundReport) => {
          assert.equal(err, null);
          assert.equal(foundReport.type, 'OtherReport');
          assert.equal(foundReport.approvalStatus, false);
          assert.equal(foundReport.student, otherReport.student);
          assert.equal(foundReport.category, otherReport.category);
          assert.equal(
              new Date(foundReport.datetime).getTime(),
              new Date('Apr 04 2017').getTime());
          assert.equal(foundReport.location, otherReport.location);
          assert.equal(foundReport.description, otherReport.description);
          done();
        });
      });
    });
  });

  describe('#modifyReport', () => {
    it('should pass a modified event report to the callback', (done) => {
      const originalEventReport = new EventReport({
        student: 'John Doe',
        event: 'someEventUid',
      });
      const updatedEventReport = {
        student: 'Jane Doe',
        approvalStatus: true,
      };
      originalEventReport.save((err, createdReport) => {
        assert.equal(err, null);
        reportManager.modifyReport(
            createdReport.id, updatedEventReport, {}, (err, actualUpdatedReport) => {
              assert.equal(err, null);
              assert.equal(actualUpdatedReport.type, 'EventReport');
              assert.equal(actualUpdatedReport.student, updatedEventReport.student);
              assert.equal(
                  actualUpdatedReport.approvalStatus,
                  updatedEventReport.approvalStatus);
              assert.equal(actualUpdatedReport.event, originalEventReport.event);
              done();
            });
      });
    });

    it('should pass a modified other report to the callback', (done) => {
      const originalOtherReport = new OtherReport({
        student: 'John Doe',
        category: 'Some category',
        datetime: 'Apr 04 2017',
        location: 'EC203',
        description: 'Some report description',
      });
      const updatedOtherReport = {
        student: 'Jane Doe',
        approvalStatus: true,
        location: 'EC204',
      };
      originalOtherReport.save((err, createdReport) => {
        assert.equal(err, null);
        reportManager.modifyReport(
            createdReport.id, updatedOtherReport, {}, (err, actualUpdatedReport) => {
              assert.equal(err, null);
              assert.equal(actualUpdatedReport.type, 'OtherReport');
              assert.equal(actualUpdatedReport.student, updatedOtherReport.student);
              assert.equal(
                  actualUpdatedReport.approvalStatus,
                  updatedOtherReport.approvalStatus);
              assert.equal(
                  actualUpdatedReport.category, originalOtherReport.category);
              assert.equal(
                  new Date(actualUpdatedReport.datetime).getTime(),
                  new Date(originalOtherReport.datetime).getTime());
              assert.equal(actualUpdatedReport.location, updatedOtherReport.location);
              assert.equal(
                  actualUpdatedReport.description, originalOtherReport.description);
              done();
            });
      });
    });
  });

  describe('#deleteReport', () => {
    it('should delete the event report', (done) => {
      const eventReport = new EventReport({
        student: 'John Doe',
        event: 'someEventUid',
      });
      eventReport.save((err, createdReport) => {
        assert.equal(err, null);
        reportManager.deleteReport(
            createdReport.id, {}, (err, deletedReport) => {
              assert.equal(err, null);
              assert.equal(deletedReport.student, eventReport.student);
              assert.equal(deletedReport.event, eventReport.event);

              Report.findById(createdReport.id, {}, (err, foundReport) => {
                assert.equal(foundReport, null);
                done();
              });
            });
      });
    });

    it('should delete the other report', (done) => {
      const otherReport = new OtherReport({
        student: 'John Doe',
        location: 'EC203',
      });
      otherReport.save((err, createdReport) => {
        assert.equal(err, null);
        reportManager.deleteReport(
            createdReport.id, {}, (err, deletedReport) => {
              assert.equal(err, null);
              assert.equal(deletedReport.student, otherReport.student);
              assert.equal(deletedReport.location, otherReport.location);

              Report.findById(createdReport.id, {}, (err, foundReport) => {
                assert.equal(foundReport, null);
                done();
              });
            });
      });
    });
  });

  describe('#getReportById', () => {
    it('should pass the event report with the given id to the callback',
       (done) => {
         const eventReport = new EventReport({
           student: 'John Doe',
           event: 'someEventUid',
         });
         eventReport.save((err, createdReport) => {
           assert.equal(err, null);
           reportManager.getReportById(
               createdReport.id, {}, (err, foundReport) => {
                 assert.equal(err, null);
                 assert.equal(foundReport.student, eventReport.student);
                 assert.equal(foundReport.event, eventReport.event);
                 done();
               });
         });
       });

    it('should pass the other report with the given id to the callback',
       (done) => {
         const otherReport = new OtherReport({
           student: 'John Doe',
           location: 'EC203',
         });
         otherReport.save((err, createdReport) => {
           assert.equal(err, null);
           reportManager.getReportById(
               createdReport.id, {}, (err, foundReport) => {
                 assert.equal(err, null);
                 assert.equal(foundReport.student, otherReport.student);
                 assert.equal(foundReport.location, otherReport.location);
                 done();
               });
         });
       });
  });

  describe('#getAllReports', () => {
    it('should pass an object of id-report pairs to the callback',
       (done) => {
         const report1 = new EventReport({
           student: 'John Doe',
           event: 'someEventUid',
         });
         const report2 = new OtherReport({
           student: 'Jane Doe',
           title: 'Some report',
         });
         report1.save((err, expectedReport1) => {
           assert.equal(err, null);
           report2.save((err, expectedReport2) => {
             assert.equal(err, null);
             reportManager.getAllReports({}, {}, (err, reports) => {
               assert.equal(err, null);
               assert.equal(Object.keys(reports).length, 2);

               const actualReport1 = reports[expectedReport1.id];
               const actualReport2 = reports[expectedReport2.id];

               assert.equal(actualReport1.type, 'EventReport');
               assert.equal(actualReport1.student, report1.student);
               assert.equal(actualReport1.event, report1.event);
               assert.equal(actualReport2.type, 'OtherReport');
               assert.equal(actualReport2.student, report2.student);
               assert.equal(actualReport2.title, report2.title);

               done();
             });
           });
         });
       });
  });

});