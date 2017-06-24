const request = require('supertest');

/**
 * Callback for CreateReport method
 *
 * @typedef {function} CreateReportCallback
 * @param {string} uid - UID of created report
 */

/**
 * Uses the API and a logged in user to create a new report.
 * To be used when a test requires a valid report to be in the database.
 * If there is an issue with creating the report, this method throws the
 * appropriate errors to stop the test.
 *
 * @param {Object} api - Running API server
 * @param {Object} owner - User data for the owner/creator of the report
 * @param {string} owner.uid - UID of the creator
 * @param {string} owner.token - Session token to access API with
 * @param {Object} reportData - Data for report
 * @param {CreateReportCallback} cb - Called upon successful creation
 */
const createReport = (api, owner, reportData, cb) => {
  request(api)
    .post('/api/reports')
    .send(reportData)
    .type('form')
    .query({ uid: owner.uid, token: owner.token })
    .expect(201)
    .end((err, res) => {
      expect(err).to.be.null;
      const reportUid = res.body.uid;
      expect(reportUid).to.not.be.null;
      cb(reportUid);
    });
};

module.exports = { createReport };
