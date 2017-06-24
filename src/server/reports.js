// import logger from 'logger.js';
import Connection from 'server/core/connection';


/**
 * Creates a new report on the server
 *
 * @example
 * const newOtherReport = {
 *  creator: '<User UID>',
 *  title: 'Studying',
 *  description: 'Studying for finals',
 *  datetime: new Date(),
 *  location: 'Library',
 *  category: 'misc',
 * };
 *
 * createReport(newOtherReport).then((result) => {
 *   logger.info(`Created new report with uid: ${result.uid}`);
 * }).catch((err) => {
 *   logger.error(err);
 * });
 *
 * @param {Object} newReport - The data for the new report
 * @returns {Promise<string, Error} - Resolves with UID of created report
 *                                    rejects with the error
 */
export function createReport(newReport) {
  return new Promise((resolve, reject) => {
    new Connection()
      .post()
      .reports()
      .data(newReport)
      .token()
      .call(resolve, reject);
  });
}

/**
 * Modifies an report on the server.
 * Must be the creator of the report or admin to modify.
 *
 * @example
 * const updatedReport.description = 'Giving up on finals';
 *
 * modifyReport(updatedReport).then((result) => {
 *   logger.info(`Report with uid ${result.uid} was updated`);
 * }).catch((err) => {
 *   logger.error(err);
 * });
 *
 * @param {string} uid - UID of report to be modified
 * @param {Object} updatedReport - Report data to be updated
 * @returns {Promise<Object, Error>} - Resolves with the updated report data
 */
export function modifyReport(uid, updatedReport) {
  return new Promise((resolve, reject) => {
    new Connection()
      .put()
      .reports()
      .data(updatedReport)
      .params({ uid })
      .token()
      .call(resolve, reject);
  });
}

/**
 * Removes an report on the server.
 * Must be the creator of the report or admin to remove
 *
 * @example
 * removeReport(someReport.uid).then(() => {
 *  logger.info(`Report with UID ${someReport.uid} removed`);
 * }).catch((err) => {
 *  logger.error(err);
 * });
 *
 * @param {string} uid - UID of the report to remove
 * @returns {Promise<,Error>} - Resolves with nothing if successful
 */
export function removeReport(uid) {
  return new Promise((resolve, reject) => {
    new Connection()
      .del()
      .reports()
      .params({ uid })
      .token()
      .call(resolve, reject);
  });
}

/**
 * Retrieves an report from the server by its UID
 *
 * @example
 * getReport('12345').then((report) => {
 *  logger.info(`Retrieved report with uid: ${report.uid}`); // == 12345
 * }).catch((err) => {
 *  logger.error(err);
 * });
 *
 * @param {string} uid - UID of the report to be retrieved
 * @returns {Promise<Object, Error} - Resolves with report info
 */
export function getReport(uid) {
  return new Promise((resolve, reject) => {
    new Connection()
      .get()
      .reports()
      .params({ uid })
      .token()
      .call(resolve, reject);
  });
}

/**
 * Retrieves all reports from the server.
 * In future, this will accept search and filter parameters.
 *
 * @example
 * getAllReports().then((reports) => {
 *  Object.keys(reports).forEach((reportUid) => {
 *    logger.info(`Retrieved report with UID: ${reportUid} and data: ${reports[reportUid]}`);
 *  });
 * }).catch((err) => {
 *  logger.error(err);
 * });
 *
 * @returns {Promise<Object, Error} - Resolves with an
 *           object of key value pairs where the key is the Report UID and the
 *           is the Report Data.
 */
export function getAllReports() {
  return new Promise((resolve, reject) => {
    new Connection()
      .get()
      .all()
      .reports()
      .token()
      .call(resolve, reject);
  });
}
