const request = require('supertest');
const utilsUser = require('../core/utils-user');
const utilsReports = require('../core/utils-reports');
const testUsers = require('../../core/users');
const testReports = require('../../core/reports');
const reportManager = require('../../../api/reports/report-manager');
const reportModels = require('../../../common/models/reports');
const server = require('../../../server');

const Report = reportModels.Report;

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

  describe('GET /api/reports', () => {
    it('should return the correct report', (done) => {
      const admin = testUsers.admin000;
      utilsUser.createAndLoginUser(api, admin, (userUid, token) => {
        const testReport = testReports.generateOtherReportData(userUid);
        utilsReports.createReport(api, { token, uid: userUid }, testReport,
          (reportUid) => {
            request(api)
              .get('/api/reports')
              .query({ uid: reportUid })
              .expect(200)
              .end((getErr, getRes) => {
                expect(getErr).to.be.null;
                const returnedReport = getRes.body;
                expect(returnedReport).to.not.be.null;
                expect(returnedReport.location).to.equal(testReport.location);
                done();
              });
          });
      });
    });
  });

  describe('PUT /api/reports', () => {
    it('should update the created other report', (done) => {
      const admin = testUsers.admin000;
      utilsUser.createAndLoginUser(api, admin, (userUid, token) => {
        const testReport = testReports.generateOtherReportData(userUid);
        utilsReports.createReport(api, { token, uid: userUid }, testReport,
          (reportUid) => {
            const fieldsToUpdate = {
              location: `${testReport.location}_edit`,
              type: testReport.type,
            };
            request(api)
              .put('/api/reports')
              .expect(200)
              .query({ token, uid: reportUid })
              .send(fieldsToUpdate)
              .end((putErr, putRes) => {
                expect(putErr).to.be.null;
                expect(putRes).to.not.be.null;
                const returnedReport = putRes.body;
                expect(returnedReport).to.not.be.null;
                expect(returnedReport.location).to.equal(fieldsToUpdate.location);
                expect(returnedReport.title).to.equal(testReport.title);

                Report.findById(reportUid, (findErr, foundReport) => {
                  expect(findErr).to.be.null;
                  expect(foundReport).to.not.be.null;

                  // Make sure the modified report was actually saved
                  expect(foundReport.location).to.equal(fieldsToUpdate.location);
                  expect(foundReport.title).to.equal(testReport.title);
                  done();
                });
              });
          });
      });
    });
  });
});
