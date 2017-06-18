// import logger from 'logger/logger';
import Connection from 'server/core/connection';

/**
 * Creates a new event on the server
 *
 * @param {EventSchema} newEvent - The data for the new event
 * @returns {Promise<string, Error} - Resolves with UID of created event
 *                                    rejects with the error
 */
export function createEvent(newEvent) {
  return new Promise((resolve, reject) => {
    new Connection()
      .post()
      .events()
      .data(newEvent)
      .token()
      .call(resolve, reject);
  });
}

/**
 * Modifies an event on the server.
 * Must be the creator of the event or admin to modify.
 *
 * @param {string} uid - UID of event to be modified
 * @param {EventSchema} updatedEvent - Event data to be updated
 * @returns {Promise<EventSchema, Error>} - Resolves with the updated event data
 */
export function modifyEvent(uid, updatedEvent) {
  return new Promise((resolve, reject) => {
    new Connection()
      .put()
      .events()
      .data(updatedEvent)
      .params({ uid })
      .token()
      .call(resolve, reject);
  });
}

/**
 * Removes an event on the server.
 * Must be the creator of the event or admin to remove
 *
 * @param {string} uid - UID of the event to remove
 * @returns {Promise<,Error>} - Resolves with nothing if successful
 */
export function removeEvent(uid) {
  return new Promise((resolve, reject) => {
    new Connection()
      .del()
      .events()
      .params({ uid })
      .token()
      .call(resolve, reject);
  });
}

/**
 * Retrieves an event from the server by its UID
 *
 * @param {string} uid - UID of the event to be retrieved
 * @returns {Promise<EventSchema, Error} - Resolves with event info
 */
export function getEvent(uid) {
  return new Promise((resolve, reject) => {
    new Connection()
      .get()
      .events()
      .params({ uid })
      .token()
      .call(resolve, reject);
  });
}

/**
 * Retrieves all events from the server.
 * In future, this will accept search and filter parameters.
 *
 * @returns {Promise<{string, EventSchema, [...]}, Error} - Resolves with an
 *           object of key value pairs where the key is the Event UID and the
 *           is the Event Data.
 */
export function getAllEvents() {
  return new Promise((resolve, reject) => {
    new Connection()
      .get()
      .all()
      .events()
      .token()
      .call(resolve, reject);
  });
}
