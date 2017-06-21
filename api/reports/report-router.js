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

reportRouter.delete('/:uid', (req, res) => {
  reportManager.deleteReport(req.params.uid, {}, (err) => {
    if (err) {
      logger.error(err);
      res.status(400).send(err).end();
      return;
    }

    res.status(204).end();
  });
});

reportRouter.get('/:uid', (req, res) => {
  reportManager.getReportById(req.params.uid, {}, (err, report) => {
    if (err) {
      logger.error(err);
      res.status(400).send(err).end();
      return;
    }

    if (!report) {
      // Report was not found.
      // TODO(jmtaber129): Add error handling for when a user is not authorized
      // to view the report.
      logger.error('Report not found.');
      res.status(404).end();
      return;
    }

    res.status(200).json(report).end();
  });
});

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
