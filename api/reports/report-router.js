const express = require('express');
const reportManager = require('api/reports/report-manager');
const logger = require('common/logger.js');

const reportRouter = express.Router();

reportRouter.post('/', (req, res) => {
  reportManager.createReport(req.body, {}, (err, report) => {
    if (err) {
      logger.error(err);
      res.status(400).send(err).end();
      return;
    }

    logger.info({
      message: 'report created',
      id: report.id,
    });

    res.status(201).location(report.id).end();
  });
});

reportRouter.put('/:uid', (req, res) => {
  reportManager.modifyReport(req.params.uid, req.body, {}, (err, report) => {
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
