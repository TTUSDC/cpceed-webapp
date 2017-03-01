var expect = require("chai").expect;

require('../server.js')

describe('reports', function() {
  var testEventReport = {
    type: "event",
    student: "1234567",
    event: "9876543321"
  }
  var testEventReportUid = undefined;
  describe('#createReport(newReport)', function() {
      it('should create a new event report.', function(done) {

        server.createReport(testEventReport).then(function(uid) {
          expect(server.dummyData.reports[uid]).to.equal(testEventReport);
          testEventReportUid = uid;
          done();
        }).catch(function(reason) {
          done(reason)
        })

      })
    }),

    describe('#modifyReport(uid, updatedReport)', function() {
      it('should modify a created event report', function(done) {
        expect(testEventReportUid).to.not.be.undefined;
        testEventReport.student = "98765432";
        server.modifyReport(testEventReportUid, testEventReport).then(function() {
          expect(server.dummyData.reports[testEventReportUid]).to.equal(testEventReport)
          done();
        }).catch(function(reason) {
          done(reason)
        })
      })
    }),

    describe('#deleteReport(uid)', function() {
      it('should delete a created event report', function(done) {
        expect(testEventReportUid).to.not.be.undefined;
        server.deleteReport(testEventReportUid).then(function() {
          expect(server.dummyData.reports[testEventReportUid]).to.be.undefined;
          done();
        }).catch(function(reason) {
          done(reason);
        })
      })
    })
})
