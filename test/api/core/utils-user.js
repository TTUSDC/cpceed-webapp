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
 * Uses the API to create and login a user.
 * This allows for easily getting a token of a valid user for other testing.
 * If there is an issue with creating or logging in, this method throws the
 * appropriate errors to stop the test.
 *
 * @param {Object} api - Running API server
 * @param {Object} user - Data needed to login user
 * @param {string} user.email - Email that isn't already in database
 * @param {string} user.password - Password for user
 * @param {string} [user.role='student'] - Role for user
 * @param {CreateAndLoginCallback} cb - Called upon success creation and login.
 */
const createAndLoginUser = (api, user, cb) => {
  const loginUserTest = (uid) => {
    request(api)
      .post('/api/auth')
      .send({
        email: user.email,
        password: user.password,
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
    .send(user)
    .type('form')
    .expect(201)
    .end((createErr, createRes) => {
      expect(createErr).to.be.null;
      const uid = createRes.body.uid;
      expect(uid).to.not.be.null;
      loginUserTest(uid);
    });
};

module.exports = { createAndLoginUser };
