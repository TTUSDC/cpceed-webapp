const request = require('supertest');

/**
 * Callback for CreateAndLogin* methods
 *
 * @typedef {function} CreateAndLoginCallback
 * @param {string} uid - UID of created user
 * @param {Object} agent - supertest agent instance with session cookie
 */

/**
 * Uses the API to create and login a user.
 * Passes the API agent to the callback, persisting the session cookie.
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
    const agent = request.agent(api);

    agent
      .post('/api/auth')
      .send({
        email: user.email,
        password: user.password,
      })
      .type('form')
      .expect(201)
      .end((loginErr) => {
        expect(loginErr).to.be.null;
        cb(uid, agent);
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
