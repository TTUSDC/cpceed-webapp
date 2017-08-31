const utilsUser = require('../core/utils-user');
const utilsReports = require('../core/utils-reports');
const testUsers = require('../../core/users');
const testReports = require('../../core/reports');
const reportManager = require('../../../api/reports/report-manager');
const reportModels = require('../../../api/reports/report-models');
const connection = require('api/connection.js');
const app = require('api/app.js');

const Report = reportModels.Report;

describe('Report Router & Integration', () => {
  before((done) => {
    connection.open().then(() => done()).catch(done);
  });

  beforeEach((done) => {
    mockgoose.reset();
    done();
  });

  after((done) => {
    connection.close().then(() => done()).catch(done);
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
      utilsUser.createAndLoginUser(app, testStudent, (userUid, agent) => {
        const testReport = testReports.generateEventReportData(userUid);
        agent
          .post('/api/reports')
          .send(testReport)
          .type('form')
          .query({ userUid })
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
      utilsUser.createAndLoginUser(app, testStudent, (userUid, agent) => {
        const testReport = testReports.generateOtherReportData(userUid);
        agent
          .post('/api/reports')
          .send(testReport)
          .type('form')
          .query({ userUid })
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
      utilsUser.createAndLoginUser(app, admin, (userUid, agent) => {
        const testReport = testReports.generateOtherReportData(userUid);
        utilsReports.createReport(agent, { uid: userUid }, testReport,
          (reportUid) => {
            agent
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
      utilsUser.createAndLoginUser(app, admin, (userUid, agent) => {
        const testReport = testReports.generateOtherReportData(userUid);
        utilsReports.createReport(agent, { uid: userUid }, testReport,
          (reportUid) => {
            const fieldsToUpdate = {
              location: `${testReport.location}_edit`,
              type: testReport.type,
            };
            agent
              .put('/api/reports')
              .expect(200)
              .query({ uid: reportUid })
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
