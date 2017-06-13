const express = require('express');
const eventManager = require('./event-manager');

const eventRouter = express.Router();

/**
 * Route for creating a new event
 * # API
 * - Endpoint: `/api/events`
 * - Verb: POST
 *
 * @typedef {function} Route-CreateEvent
 * @param {Object} req - Express request object
 * @param {EventSchema} req.body - The event to be created
 * @param {Object} res - Express result object
 * @param {string} res.body - UID of created event or error message
 * @param {number} res.status - 201 on success
 */
eventRouter.post('/', (req, res) => {
  eventManager.createEvent(req.body, {}, (err, event) => {
    if (err) {
      res.status(400).json(err).end();
      return;
    }
    res.status(201).json(event.id).end();
  });
});

/**
 * Route for modifying an existing event
 * # API
 * - Endpoint: `/api/events`
 * - Verb: PUT
 *
 * @typedef {function} Route-ModifyEvent
 * @param {Object} req - Express request object
 * @param {string} req.query.uid - UID of event to be updated
 * @param {EventSchema} req.body - Updated fields of the event
 * @param {Object} res - Express result object
 * @param {EventSchema|string} res.body - Modified event | error message
 * @param {number} res.status - 200 on success
 * @param {string} token - Admin or creator of event
 */
eventRouter.put('/', (req, res) => {
  eventManager.modifyEvent(req.query.uid, req.body, res.locals,
    (err, event) => {
      if (err) {
        res.status(400).json(err).end();
        return;
      }

      res.status(200).json(event).end();
    });
});

/**
 * Route for deleting an existing event
 * # API
 * - Endpoint: `/api/events`
 * - Verb: DELETE
 *
 * @typedef {function} Route-DeleteEvent
 * @param {Object} req - Express request object
 * @param {string} req.query.uid - UID of event to be deleted
 * @param {string} token - Admin or creator of event
 * @param {Object} res - Express result object
 * @param {number} res.status - 200 on success
 */
eventRouter.delete('/', (req, res) => {
  eventManager.deleteEvent(req.query.uid, res.locals, (err, result) => {
    if (err) {
      res.status(400).json(err).end();
      return;
    }

    res.status(200).json(result).end();
  });
});

/**
 * Route for retrieving a single, existing event by its UID
 * # API
 * - Endpoint: `/api/events`
 * - Verb: GET
 *
 * @typedef {function} Route-GetEventById
 * @param {Object} req - Express request object
 * @param {string} req.query.uid - UID of event to be retrieved
 * @param {string} token
 * @param {Object} res - Express result object
 * @param {number} res.status - 200 on success
 */
eventRouter.get('/', (req, res) => {
  eventManager.getEventById(res.query.uid, req.body, res.locals,
    (err, event) => {
      if (err) {
        res.status(400).json(err).end();
        return;
      }

      res.status(200).json(event).end();
    });
});

/**
 * Route for retrieving all events
 * # API
 * - Endpoint: `/api/events/all`
 * - Verb: GET
 *
 * @typedef {function} Route-GetAllEvents
 * @param {Object} req - Express request object
 * @param {string} token
 * @param {Object} res - Express result object
 * @param {number} res.status - 200 on success
 */
eventRouter.get('/all', (req, res) => {
  eventManager.getAllEvents(req.body, {}, (err, results) => {
    if (err) {
      res.status(400).json(err).end();
      return;
    }

    res.status(200).json(results).end();
  });
});

module.exports = eventRouter;
