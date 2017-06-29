const reportManager = require('../../../api/reports/report-manager');
const reportModels = require('../../../common/models/reports');
// const logger = require('common/logger');

const Report = reportModels.Report;
const EventReport = reportModels.EventReport;
const OtherReport = reportModels.OtherReport;

mockgoose(mongoose);

describe('reportManager', () => {
  // Mockgoose doesn't start the mock until after 'mongoose.connect()' is
  // called.
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
        expect(err).to.be.null;
        expect(createdReport.type).to.be.equal('EventReport');
        expect(createdReport.approvalStatus).to.be.false;
        expect(createdReport.student).to.be.equal(eventReport.student);
        expect(createdReport.event).to.be.equal(eventReport.event);

        Report.findById(createdReport.id, (err, foundReport) => {
          expect(err).to.be.null;
          expect(foundReport.type).to.be.equal('EventReport');
          expect(foundReport.approvalStatus).to.be.false;
          expect(foundReport.student).to.be.equal(eventReport.student);
          expect(foundReport.event).to.be.equal(eventReport.event);
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
        datetime: 'Apr 04 2017 18:30',
        location: 'EC203',
        description: 'Some report description',
      };

      reportManager.createReport(otherReport, {}, (err, createdReport) => {
        expect(err).to.be.null;
        expect(createdReport.type).to.be.equal('OtherReport');
        expect(createdReport.approvalStatus).to.be.false;
        expect(createdReport.student).to.be.equal(otherReport.student);
        expect(createdReport.category).to.be.equal(otherReport.category);
        expect(createdReport.datetime).to.be.sameMoment(otherReport.datetime);
        expect(createdReport.location).to.be.equal(otherReport.location);
        expect(createdReport.description).to.be.equal(otherReport.description);

        Report.findById(createdReport.id, (err, foundReport) => {
          expect(err).to.be.null;
          expect(foundReport.type).to.be.equal('OtherReport');
          expect(foundReport.approvalStatus).to.be.false;
          expect(foundReport.student).to.be.equal(otherReport.student);
          expect(foundReport.category).to.be.equal(otherReport.category);
          expect(foundReport.datetime).to.be.sameMoment(otherReport.datetime);
          expect(foundReport.location).to.be.equal(otherReport.location);
          expect(foundReport.description).to.be.equal(otherReport.description);
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
        type: 'event',
      };

      originalEventReport.save((err, createdReport) => {
        expect(err).to.be.null;
        reportManager.modifyReport(
            createdReport.id, updatedEventReport, {},
            (err, actualUpdatedReport) => {
              expect(err).to.be.null;
              expect(actualUpdatedReport.type).to.be.equal('EventReport');
              expect(actualUpdatedReport.student)
                  .to.be.equal(updatedEventReport.student);
              expect(actualUpdatedReport.approvalStatus)
                  .to.be.equal(updatedEventReport.approvalStatus);
              expect(actualUpdatedReport.event)
                  .to.be.equal(originalEventReport.event);
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
        approvalStatus: false,
      });

      const updatedOtherReport = {
        student: 'Jane Doe',
        approvalStatus: true,
        location: 'EC204',
        type: 'other',
      };

      originalOtherReport.save((err, createdReport) => {
        console.log(createdReport, 'createdReport');
        expect(err).to.be.null;
        reportManager.modifyReport(
            createdReport.id, updatedOtherReport, {},
            (err, actualUpdatedReport) => {
              console.log(actualUpdatedReport, 'actualUpdatedReport');
              expect(err).to.be.null;
              expect(actualUpdatedReport.type).to.be.equal('OtherReport');
              expect(actualUpdatedReport.student)
                  .to.be.equal(updatedOtherReport.student);
              expect(actualUpdatedReport.approvalStatus)
                  .to.be.equal(updatedOtherReport.approvalStatus);
              expect(actualUpdatedReport.category)
                  .to.be.equal(originalOtherReport.category);
              expect(actualUpdatedReport.datetime)
                  .to.be.sameMoment(originalOtherReport.datetime);
              expect(actualUpdatedReport.location)
                  .to.be.equal(updatedOtherReport.location);
              expect(actualUpdatedReport.description)
                  .to.be.equal(originalOtherReport.description);
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
        expect(err).to.be.null;
        reportManager.deleteReport(
            createdReport.id, {}, (err, deletedReport) => {
              expect(err).to.be.null;
              expect(deletedReport.student).to.be.equal(eventReport.student);
              expect(deletedReport.event).to.be.equal(eventReport.event);

              Report.findById(createdReport.id, {}, (err, foundReport) => {
                expect(foundReport).to.be.null;
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
        expect(err).to.be.null;
        reportManager.deleteReport(
            createdReport.id, {}, (err, deletedReport) => {
              expect(err).to.be.null;
              expect(deletedReport.student).to.be.equal(otherReport.student);
              expect(deletedReport.location).to.be.equal(otherReport.location);

              Report.findById(createdReport.id, {}, (err, foundReport) => {
                expect(foundReport).to.be.null;
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
           expect(err).to.be.null;
           reportManager.getReportById(
               createdReport.id, {}, (err, foundReport) => {
                 expect(err).to.be.null;
                 expect(foundReport.student).to.be.equal(eventReport.student);
                 expect(foundReport.event).to.be.equal(eventReport.event);
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
           expect(err).to.be.null;
           reportManager.getReportById(
               createdReport.id, {}, (err, foundReport) => {
                 expect(err).to.be.null;
                 expect(foundReport.student).to.be.equal(otherReport.student);
                 expect(foundReport.location).to.be.equal(otherReport.location);
                 done();
               });
         });
       });
  });

  describe('#getAllReports', () => {
    it('should pass an object of id-report pairs to the callback', (done) => {
      const report1 = new EventReport({
        student: 'John Doe',
        event: 'someEventUid',
      });

      const report2 = new OtherReport({
        student: 'Jane Doe',
        title: 'Some report',
      });

      report1.save((err, expectedReport1) => {
        expect(err).to.be.null;
        report2.save((err, expectedReport2) => {
          expect(err).to.be.null;
          reportManager.getAllReports({}, {}, (err, reports) => {
            expect(err).to.be.null;
            expect(Object.keys(reports).length).to.be.equal(2);

            const actualReport1 = reports[expectedReport1.id];
            const actualReport2 = reports[expectedReport2.id];

            expect(actualReport1.type).to.be.equal('EventReport');
            expect(actualReport1.student).to.be.equal(report1.student);
            expect(actualReport1.event).to.be.equal(report1.event);
            expect(actualReport2.type).to.be.equal('OtherReport');
            expect(actualReport2.student).to.be.equal(report2.student);
            expect(actualReport2.title).to.be.equal(report2.title);

            done();
          });
        });
      });
    });
  });
});
