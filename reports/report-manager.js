var reportModels = require('./report-models');
var Report = reportModels.Report;
var EventReport = reportModels.EventReport;
var OtherReport = reportModels.OtherReport;

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
var createReport = (reqData, locals, createCallback) => {
  // TODO(jmtaber129): Check that the student UID matches the requesting user,
  // or the requesting user is an admin.
  var report;
  if (reqData.type == 'event') {
    report = new EventReport({
      approvalStatus: false,
      student: reqData.student,
      event: reqData.event,
    });
  } else if (reqData.type == 'other') {
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
    createCallback({message: "Invalid report type."});
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
var modifyReport = (reportUid, reqData, locals, modifyCallback) => {
  Report.findById(reportUid, (err, report) => {
    if (err) {
      modifyCallback(err);
      return;
    }

    // If the report's student UID does not match the user UID, and the user is
    // not an admin, the report should not be updated.
    // TODO(jmtaber129): Check report's student UID and user UID, and add error
    // handling.

    // Update fields by checking if the field in the request is defined and
    // non-null, then setting the document field to the request field if it is.

    // Generic fields.
    report.approvalStatus =
        newIfPresent(reqData.approvalStatus, report.approvalStatus);
    report.student = newIfPresent(reqData.student, report.student);

    if (report.type == EventReport.modelName) {
      // Fields specific to event reports.
      report.event = newIfPresent(reqData.event, report.event);

    } else if (report.type == OtherReport.modelName) {
      // Fields specific to other reports.
      report.category = newIfPresent(reqData.category, report.category);
      report.datetime = newIfPresent(reqData.datetime, report.datetime);
      report.location = newIfPresent(reqData.location, report.location);
      report.title = newIfPresent(reqData.title, report.title);
      report.description =
          newIfPresent(reqData.description, report.description);
    }

    report.save(modifyCallback);
  });
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
var deleteReport = (reportUid, locals, deleteCallback) => {
  Report.findById(reportUid, (err, report) => {
    if (err) {
      deleteCallback(err);
      return;
    }

    if (!report) {
      // TODO(jmtaber129): Better error handling when report can't be found.
      deleteCallback({message: 'Report not found.'});
      return;
    }

    // If the report's student UID does not match the user UID, and the user is
    // not an admin, 'report' should not be deleted.
    // TODO(jmtaber129): Check report's student UID and user UID, and add error
    // handling.

    report.remove(deleteCallback);
  });
};

/**
 * Finds a specific report, and calls a callback once the report is found.
 * @param {string} reportUid - The UID corresponding to the report to be found.
 * @param {Object} locals - An object containing the current request's local
 *     variables.
 * @param {reportCallback} queryCallback - Called once the operation finishes.
 */
var getReportById = (reportUid, locals, queryCallback) => {
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
var getAllReports = (reqData, locals, queryCallback) => {
  conditions = {};

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

    returnObject = {};

    reports.forEach((report) => {
      returnObject[report.id] = report;

      // TODO(jmtaber129): Add point value to report in 'returnObject'.
    });

    queryCallback(err, returnObject);
  });

};

/** 
 * If the new value is defined and non-null, returns the new value.  Otherwise,
 * returns the old value.
 * @param {T} newValue - A new value value that may or may not be defined and
 *     non-null.
 * @param {T} oldValue - A old value that is defined and non-null.
 * @return {T} The new value if it is defined and non-null.  The old value if
 *     the new value is undefined or null.
 * @template T
 */
var newIfPresent = (newValue, oldValue) => {
  if (newValue == undefined || newValue == null) {
    return oldValue;
  }
  return newValue;
};

module.exports = {createReport, modifyReport, deleteReport, getReportById,
                  getAllReports};