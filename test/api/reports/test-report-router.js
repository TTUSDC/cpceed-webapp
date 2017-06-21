const request = require('supertest');
const utilsUser = require('../core/utils-user');
const utilsReports = require('../core/utils-reports');
const testUsers = require('../../core/users');
const testReports = require('../../core/reports');
const reportManager = require('../../../api/reports/report-manager');
const reportModels = require('../../../api/reports/report-models');
const server = require('../../../server');

const Report = reportModels.Report;
const ReportReport = reportModels.ReportReport;
const OtherReport = reportModels.OtherReport;

let api;
mockgoose(mongoose);

describe('Report Router & Integration', () => {
  before((done) => { api = server.start(done); });

  beforeEach((done) => {
    mockgoose.reset();
    done();
  });

  after((done) => {
    server.stop(() => {
      mongoose.unmock(done);
    });
  });

  describe('POST /api/reports', () => {
    before((done) => {
      sinon.spy(reportManager, 'createReport');
      done();
    });

    afterEach((done) => {
      reportManager.createReport.reset();
      done();
    });

    after((done) => {
      reportManager.createReport.restore();
      done();
    });

    it('should return 201 and the created event report UID', (done) => {
      const testStudent = testUsers.student000;
      utilsUser.createAndLoginUser(api, testStudent, (userUid, token) => {
        const testReport = testReports.generateEventReportData(userUid);
        request(api)
          .post('/api/reports')
          .send(testReport)
          .type('form')
          .query({ userUid, token })
          .expect(201)
          .end((err, res) => {
            expect(err).to.be.null;
            const reportUid = res.body.uid;
            expect(reportUid).to.not.be.null;
            expect(reportManager.createReport).to.have.been.calledOnce;
            Report.findById(reportUid, (findErr, foundReport) => {
              expect(findErr).to.be.null;
              expect(foundReport.student).to.equal(testReport.student);
              done();
            });
          });
      });
    });

    it('should return 201 and the created other report UID', (done) => {
      const testStudent = testUsers.student000;
      utilsUser.createAndLoginUser(api, testStudent, (userUid, token) => {
        const testReport = testReports.generateOtherReportData(userUid);
        request(api)
          .post('/api/reports')
          .send(testReport)
          .type('form')
          .query({ userUid, token })
          .expect(201)
          .end((err, res) => {
            expect(err).to.be.null;
            const reportUid = res.body.uid;
            expect(reportUid).to.not.be.null;
            expect(reportManager.createReport).to.have.been.calledOnce;
            Report.findById(reportUid, (findErr, foundReport) => {
              expect(findErr).to.be.null;
              expect(foundReport.student).to.equal(testReport.student);
              done();
            });
          });
      });
    });
  });
});
