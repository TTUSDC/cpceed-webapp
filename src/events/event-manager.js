const eventModels = require('./event-models');

const Event = eventModels.Event;

/**
 * Callback used by event CRUD methods that returns a single event.
 * @callback eventCallback
 * @param {Error} err - An error that occurred during the operation. Null if no
 *    errors occurred.
 * @param {Event} event - The event operated on.
 */

/**
 * Creates a event using fields from the request object then calls back when
 * the database save finishes.
 * @param {Object} reqData - The request object containing the event data to
 *   be created.
 * @param {Object} locals - An object containg the current request's local
 *   variables.
 * @param {eventCallback} createCallback - Called once the operation finishes.
 */
const createEvent = (reqData, locals, createCallback) => {
  // TODO(asclines): Add checks for required data and expection handling
  const event = new Event({
    creator: reqData.creator,
    category: reqData.category,
    datetime: reqData.datetime,
    location: reqData.location,
    title: reqData.title,
    description: reqData.description,
  });
  event.save(createCallback);
};


module.exports = { createEvent };
