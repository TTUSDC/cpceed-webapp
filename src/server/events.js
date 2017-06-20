// import logger from 'logger.js';
import Connection from 'server/core/connection';


/**
 * Creates a new event on the server
 *
 * @example
 * const newEvent = {
 *  creator: '<User UID>',
 *  title: 'Studying',
 *  description: 'Studying for finals',
 *  datetime: new Date(),
 *  location: 'Library',
 *  category: 'misc',
 * };
 *
 * createEvent(newEvent).then((result) => {
 *   logger.info(`Created new event with uid: ${result.uid}`);
 * }).catch((err) => {
 *   logger.error(err);
 * });
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
 * @example
 * const updatedEvent.description = 'Giving up on finals';
 *
 * modifyEvent(updatedEvent).then((result) => {
 *   logger.info(`Event with uid ${result.uid} was updated`);
 * }).catch((err) => {
 *   logger.error(err);
 * });
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
 * @example
 * removeEvent(someEvent).then(() => {
 *  logger.info(`Event with UID ${someEvent.uid} removed`);
 * }).catch((err) => {
 *  logger.error(err);
 * });
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
 * @example
 * getEvent('12345').then((event) => {
 *  logger.info(`Retrieved event with uid: ${event.uid}`); // == 12345
 * }).catch((err) => {
 *  logger.error(err);
 * });
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
 * @example
 * getAllEvents().then((events) => {
 *  Object.keys(events).forEach((eventUid) => {
 *    logger.info(`Retrieved event with UID: ${eventUid} and data: ${events[eventUid]}`);
 *  });
 * }).catch((err) => {
 *  logger.error(err);
 * });
 *
 * @returns {Promise<Object, Error} - Resolves with an
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
