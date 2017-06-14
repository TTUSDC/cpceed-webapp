const request = require('supertest');
const chai = require('chai');

chai.use(require('sinon-chai'));

const expect = chai.expect;

/**
 * Callback for CreateAndLogin* methods
 *
 * @typedef {function} CreateAndLoginCallback
 * @param {string} uid - UID of created user
 * @param {string} token - Session token for user
 */

/**
 * Uses the API to create and login a student user.
 * This allows for easily getting a token of a valid user for other testing.
 * If there is an issue with creating or logging in, this method throws the
 * appropriate errors to stop the test.
 *
 * @param {Object} api - Running API server
 * @param {Object} student - Data needed to login student
 * @param {string} student.email - Email that isn't already in database
 * @param {string} student.password - Password for student
 * @param {CreateAndLoginCallback} cb - Called upon success creation and login.
 */
const createAndLoginStudent = (api, student, cb) => {
  const loginUserTest = (uid) => {
    request(api)
      .post('/api/auth')
      .send({
        email: student.email,
        password: student.password,
      })
      .type('form')
      .expect(201)
      .end((loginErr, loginRes) => {
        expect(loginErr).to.be.null;
        const token = loginRes.body.token;
        expect(token).to.exist;
        cb(uid, token);
      });
  };

  request(api)
    .post('/api/users')
    .send(student)
    .type('form')
    .expect(201)
    .end((createErr, createRes) => {
      expect(createErr).to.be.null;
      const uid = createRes.body.uid;
      expect(uid).to.not.be.null;
      loginUserTest(uid);
    });
};

module.exports = { createAndLoginStudent };
