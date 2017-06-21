const express = require('express');
const eventManager = require('api/events/event-manager');
const logger = require('common/logger.js');
const authManager = require('api/auth/auth-manager');

const eventRouter = express.Router();

/**
 * Route for creating a new event
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
eventRouter.post('/',
  authManager.verify,
  (req, res) => {
    eventManager.createEvent(req.body, {}, (err, event) => {
      if (err) {
        logger.error(err);
        res.status(400).json(err).end();
        return;
      }
      res.status(201).json({ uid: event.id }).end();
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
 * @property {string} req.query.uid - UID of event to be updated
 * @property {string} req.query.token - Admin or creator of event
 * @property {EventSchema} req.body - Updated fields of the event
 * @param {Object} res - Express result object
 * @property {EventSchema|string} res.body - Modified event | error message
 * @property {number} res.status - 200 on success
 */
eventRouter.put('/', (req, res) => {
  eventManager.modifyEvent(req.query.uid, req.body, res.locals,
    (err, eventData) => {
      if (err) {
        logger.error(err);
        res.status(400).json(err).end();
        return;
      }
      res.status(200).json(eventData).end();
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
 * @property {string} req.query.uid - UID of event to be deleted
 * @property {string} req.query.token - Admin or creator of event
 * @param {Object} res - Express result object
 * @property {number} res.status - 200 on success
 */
eventRouter.delete('/', (req, res) => {
  eventManager.deleteEvent(req.query.uid, res.locals, (err, result) => {
    if (err) {
      logger.error(err);
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
 * @property {string} req.query.uid - UID of event to be retrieved
 * @property {string} req.query.token - Admin or creator of event
 * @param {Object} res - Express result object
 * @property {number} res.status - 200 on success
 */
eventRouter.get('/', (req, res) => {
  eventManager.getEventById(req.query.uid, {},
    (err, event) => {
      if (err) {
        logger.error(err);
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
 * @property {string} req.query.token - Anybody
 * @param {Object} res - Express result object
 * @property {number} res.status - 200 on success
 */
eventRouter.get('/all', (req, res) => {
  eventManager.getAllEvents(req.body, {}, (err, results) => {
    if (err) {
      logger.error(err);
      res.status(400).json(err).end();
      return;
    }

    res.status(200).json(results).end();
  });
});

module.exports = { eventRouter };
