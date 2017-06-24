const express = require('express');
const reportManager = require('api/reports/report-manager');
const logger = require('common/logger.js');
const authManager = require('api/auth/auth-manager');


const reportRouter = express.Router();


/**
 * Route for creating a new report
 * - Endpoint: `/api/reports`
 * - Verb: POST
 *
 * @typedef {function} Route-CreateReport
 * @param {Object} req - Express request object
 * @param {Object} req.body - The report to be created
 * @param {Object} res - Express result object
 * @param {string} res.body - UID of created report or error message
 * @param {number} res.status - 201 on success
 */
reportRouter.post('/',
  authManager.verify,
  (req, res) => {
    reportManager.createReport(req.body, {}, (err, report) => {
      if (err) {
        logger.error(err);
        res.status(400).send(err).end();
        return;
      }

      res.status(201).json({ uid: report.id }).end();
    });
  });

/**
 * Route for modifying an existing report
 * - Endpoint: `/api/reports`
 * - Verb: POST
 *
 * @typedef {function} Route-ModifyReport
 * @param {Object} req - Express request object
 * @param {string} req.query.uid - UID of report to be updated
 * @param {string} req.query.token - Admin or creator of report
 * @param {Object} req.body - Updated fields of the report
 * @param {Object} res - Express result object
 * @param {EventSchema|string} res.body - Modified report | error message
 * @param {number} res.status - 200 on success
 */
reportRouter.put('/',
  authManager.verify,
  (req, res) => {
    reportManager.modifyReport(req.query.uid, req.body, res.locals,
    (err, report) => {
      if (err) {
        logger.error(err);
        res.status(400).send(err).end();
        return;
      }

      res.status(200).json(report).end();
    });
  });

/**
 * Route for deleting an existing event
 * - Endpoint: `/api/reports`
 * - Verb: DELETE
 *
 * @typedef {function} Route-DeleteReport
 * @param {Object} req - Express request object
 * @property {string} req.query.uid - UID of report to be deleted
 * @property {string} req.query.token - Admin or creator of report
 * @param {Object} res - Express result object
 * @property {number} res.status - 200 on success
 */
reportRouter.delete('/',
  authManager.verify,
  (req, res) => {
    reportManager.deleteReport(req.query.uid, {}, (err) => {
      if (err) {
        logger.error(err);
        res.status(400).send(err).end();
        return;
      }

      res.status(204).end();
    });
  });

reportRouter.get('/', (req, res) => {
  reportManager.getReportById(req.query.uid, {},
    (err, report) => {
      if (err) {
        logger.error(err);
        res.status(400).send(err).end();
        return;
      }
      res.status(200).json(report).end();
    });
});

/**
 * Route for retrieving a single, existing event by its UID
 * - Endpoint: `/api/reports`
 * - Verb: GET
 *
 * @typedef {function} Route-GetReportById
 * @param {Object} req - Express request object
 * @param {string} req.query.uid - UID of report to be retrieved
 * @param {string} req.query.token - Admin or creator of report
 * @param {Object} res - Express result object
 * @param {number} res.status - 200 on success
 */
reportRouter.get('/', (req, res) => {
  reportManager.getAllReports(req.params, {}, (err, reports) => {
    if (err) {
      logger.error(err);
      res.status(400).send(err).end();
      return;
    }

    res.status(200).json(reports).end();
  });
});

module.exports = { reportRouter };
