const eventModels = require('./event-models');

const Event = eventModels.Event;

/**
 * Callback used by event CRUD methods that returns a single event.
 * @typdef {function} EventCallback
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
 * @param {EventCallback} createCallback - Called once the operation finishes.
 */
const createEvent = (reqData, locals, createCallback) => {
  // TODO(asclines): Add checks for required data and expection handling

  // TODO(asclines): Check the UID of the logged in user and make sure they
  // are either the creator of the event or an admin.

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

/**
 * Modifies a specific event with the fields in the request object then calls
 * back when the database update finishes.
 * @param {string} event Uid - The UID corresponding to the event to be
 *   modified.
 * @param {Object} reqData - The request object containing the new event fields.
 * @param {Object} locals - An object containg the current request's local
 *   variables.
 * @param {EventCallback} modifyCallback - Called once the operation finishes.
 */
const modifyEvent = (eventUid, reqData, locals, modifyCallback) => {
  // TODO(asclines): Add checks for required data and expection handling

  // TODO(asclines): Check the UID of the logged in user and make sure they
  // are either the creator of the event or an admin.
  const conditions = { _id: eventUid };
  const update = {};

  Object.keys(reqData).forEach((key) => {
    update[key] = reqData[key];
  });

  const options = { new: true };
  Event.findOneAndUpdate(conditions, { $set: update }, options, modifyCallback);
};


/**
 * Deletes a specific event and calls back once database deletion finishes.
 * @param {string} eventUid - The UID of the event to be deleted.
 * @param {Object} locals - An object containg the current request's local
 *   variables.
 * @param {EventCallback} deleteCallback - Called once the operation is done.
 */
const deleteEvent = (eventUid, locals, deleteCallback) => {
  // TODO(asclines): Check the UID of the logged in user and make sure they
  // are either the creator of the event or an admin.

  // TODO(asclines): Look into better error handling.

  Event.findByIdAndRemove(eventUid, deleteCallback);
};

/**
 * Finds a specific event and calls back once find operation finishes.
 * @param {string} eventUid - The UID of the event to be found.
 * @param {Object} locals - An object containing the current request's
 *   local variables.
 * @param {EventCallback} getCallback - Called once the operation is done.
 */
const getEventById = (eventUid, locals, getCallback) => {
  // TODO(asclines): Add checks for required data and expection handling

  // TODO(asclines): Check the UID of the logged in user and make sure they
  // have permisssion to get this event.

  Event.findById(eventUid, (err, results) => {
    const eventData = {
      creator: results.creator,
      category: results.category,
      datetime: results.datetime,
      location: results.location,
      title: results.title,
      description: results.description,
    };
    getCallback(err, eventData);
  });
};

const getAllEvents = (reqData, locals, getAllCallback) => {
 // TODO(asclines): Add checks for required data and expection handling

//   // TODO(asclines): Check the UID of the logged in user and make sure they
//   // have permission to call this method.

  const conditions = locals.conditions || {};
  Event.find(conditions, (err, events) => {
    if (err) {
      getAllCallback(err);
      return;
    }

    const results = {};
    events.forEach((event) => {
      results[event.id] = event;
    });

    getAllCallback(err, results);
  });
};


module.exports = {
  createEvent,
  modifyEvent,
  deleteEvent,
  getEventById,
  getAllEvents,
};
