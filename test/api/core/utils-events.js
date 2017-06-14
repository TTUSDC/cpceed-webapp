const request = require('supertest');
const chai = require('chai');

const expect = chai.expect;

/**
 * Callback for CreateEvent method
 *
 * @typedef {function} CreateEventCallback
 * @param {string} uid - UID of created event
 */

/**
 * Uses the API and a logged in user to create a new event.
 * To be used when a test requires a valid event to be in the database.
 * If there is an issue with creating the event, this method throws the
 * appropriate errors to stop the test.
 *
 * @param {Object} api - Running API server
 * @param {Object} owner - User data for the owner/creator of the event
 * @param {string} owner.uid - UID of the creator
 * @param {string} owner.token - Session token to access API with
 * @param {EventSchema} eventData - Data for event
 * @param {CreateEventCallback} cb - Called upon successful creation
 */
const createEvent = (api, owner, eventData, cb) => {
  request(api)
    .post('/api/events')
    .send(eventData)
    .type('form')
    .query({ uid: owner.uid, token: owner.token })
    .expect(201)
    .end((err, res) => {
      expect(err).to.be.null;
      const eventUid = res.body.uid;
      expect(eventUid).to.not.be.null;
      cb(eventUid);
    });
};

module.exports = { createEvent };
