const reportModels = require('api/reports/report-models');
const logger = require('common/logger');
const newIfPresent = require('api/core/utils').newIfPresent;

const Report = reportModels.Report;
const EventReport = reportModels.EventReport;
const OtherReport = reportModels.OtherReport;

/**
 * Callback used by report CRUD methods that return only one report.
 * @callback reportCallback
 * @param {Error} err - An error that occurred during the operation.  Null if no
 *     errors occurred.
 * @param {Report} report - The report operated on.
 */

/**
 * Creates a report with the fields in the request object, and calls a callback
 * when the database save finishes.
 * @param {Object} reqData - The request object representing the report to be
 *     created.
 * @param {Object} locals - An object containing the current request's local
 *     variables.
 * @param {reportCallback} createCallback - Called once the operation finishes.
 */
const createReport = (reqData, locals, createCallback) => {
  // TODO(jmtaber129): Check that the student UID matches the requesting user,
  // or the requesting user is an admin.
  let report;
  if (reqData.type === 'event') {
    report = new EventReport({
      approvalStatus: false,
      student: reqData.student,
      event: reqData.event,
    });
  } else if (reqData.type === 'other') {
    report = new OtherReport({
      approvalStatus: false,
      student: reqData.student,
      category: reqData.category,
      datetime: reqData.datetime,
      location: reqData.location,
      title: reqData.title,
      description: reqData.description,
    });
  } else {
    // TODO(jmtaber129): Better error handling for invalid report types.
    createCallback({ message: 'Invalid report type.' });
    return;
  }

  report.save(createCallback);
};

/**
 * Modifies a specific report according to the fields in the request object, and
 * calls a callback when the database save finishes.
 * @param {string} reportUid - The UID corresponding to the report to be
 *     modified.
 * @param {Object} reqData - The request object containing the fields to be
 *     modified.
 * @param {Object} locals - An object containing the current request's local
 *     variables.
 * @param {reportCallback} modifyCallback - Called once the operation finishes.
 */
const modifyReport = (reportUid, reqData, locals, modifyCallback) => {
  // TODO(asclines): Add checks for required data and expection handling

  // TODO(asclines): Check the UID of the logged in user and make sure they
  // are either the creator of the report or an admin.
  const conditions = { _id: reportUid };
  const update = {};

  if (reqData.type !== 'event' && reqData.type !== 'other') {
    modifyCallback(new Error('Invalid report type'));
    return;
  }


  Object.keys(reqData).forEach((key) => {
    if (key !== 'type') { update[key] = reqData[key]; }
  });

  const options = { new: true };

  if (reqData.type === 'other') {
    OtherReport.findOneAndUpdate(conditions, { $set: update }, options, modifyCallback);
  } else {
    EventReport.findOneAndUpdate(conditions, { $set: update }, options, modifyCallback);
  }
};

/**
 * Deletes a specific report, and calls a callback once the database deletion
 * finishes.
 * @param {string} reportUid - The UID corresponding to the report to be
 *     deleted.
 * @param {Object} locals - An object containing the current request's local
 *     variables.
 * @param {reportCallback} deleteCallback - Called once the operation finishes.
 */
const deleteReport = (reportUid, locals, deleteCallback) => {
  // TODO(asclines): Check the UID of the logged in user and make sure they
  // are either the creator of the report or an admin.

  // TODO(asclines): Look into better error handling.
  Report.findByIdAndRemove(reportUid, deleteCallback);
};

/**
 * Finds a specific report, and calls a callback once the report is found.
 * @param {string} reportUid - The UID corresponding to the report to be found.
 * @param {Object} locals - An object containing the current request's local
 *     variables.
 * @param {reportCallback} queryCallback - Called once the operation finishes.
 */
const getReportById = (reportUid, locals, queryCallback) => {
  Report.findById(reportUid, (err, report) => {
    if (err) {
      queryCallback(err);
      return;
    }

    // If the report's student UID does not match the user UID, and the user is
    // not an admin, 'report' should not be returned.
    // TODO(jmtaber129): Check report's student UID and user UID, and add error
    // handling.

    queryCallback(err, report);
  });
};

/**
 * Callback used by report CRUD methods that return multiple reports.
 * @callback multipleReportsCallback
 * @param {Error} err - An error that occurred during the operation.  Null if no
 *     errors occurred.
 * @param {Object.<string, Report>} reports - An object of reports with their
 *     UIDs as keys.
 */

/**
 * Finds all reports, and calls a callback once all reports are found.
 * @param {Object} reqData - An object containing additional search parameters
 *     (not yet implemented).
 * @param {Object} locals - An object containing the current request's local
 *     variables.
 * @param {multipleReportsCallback} queryCallback - Called once the operation
 *     finishes.
 */
const getAllReports = (reqData, locals, queryCallback) => {
  const conditions = {};

  // If the user is not an admin, limit the results to reports with the user's
  // UID.  If the user is not an admin, and one of the query parameters is a
  // student UID other than their own, handle it as an error.
  // TODO(jmtaber129): Set conditions.student to user UID for non-admins.
  // TODO(jmtaber129): Add error handling for requesting reports with student
  // UIDs other than the UID of a non-admin user.

  // TODO(jmtaber129): Set additional conditions once query parameters are
  // accepted in the request object.

  // Both report types are in the same collection, and querying a model queries
  // the entire collection, so querying one report model will return results for
  // both report types.
  Report.find(conditions, (err, reports) => {
    if (err) {
      queryCallback(err);
      return;
    }

    const returnObject = {};

    reports.forEach((report) => {
      returnObject[report.id] = report;

      // TODO(jmtaber129): Add point value to report in 'returnObject'.
    });

    queryCallback(err, returnObject);
  });
};

module.exports = { createReport,
  modifyReport,
  deleteReport,
  getReportById,
  getAllReports };
