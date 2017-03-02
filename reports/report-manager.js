var reportModels = require('./report-models')
var EventReport = reportModels.EventReport;
var OtherReport = reportModels.OtherReport;

var createReport = function(reqData, locals, saveCallback) {
  // TODO(jmtaber129): Check that the student UID matches the requesting user, or the
  // requesting user is an admin.
  var report;
  if (reqData.type == 'event') {
    var report = new EventReport({
      type: reqData.type,
      approvalStatus: false,
      student: reqData.student,
      event: reqData.event,
    });
  } else if (reqData.type == 'other') {
    var report = new OtherReport({
      type: reqData.type,
      approvalStatus: false,
      student: reqData.student,
      category: reqData.category,
      datetime: reqData.datetime,
      location: reqData.location,
      title: reqData.title,
      description: reqData.description,
    });
  } else {
    // TODO(jmtaber129): Error handling for invalid report types.
  }
  
  report.save(saveCallback); 
};

var deleteReport = function(reportUid, locals, deleteCallback) {
  EventReport.findById(reportUid, (err, report) => {
    if (err) {
      deleteCallback(err);
      return;
    }
    
    if (report == null) {
      // TODO(jmtaber129): Better error handling when report can't be found.
      deleteCallback({ message: "Report not found." });
      return;
    }
    
    // If the report's student UID does not match the user UID, and the user is not an
    // admin, 'report' should not be deleted.
    // TODO(jmtaber129): Check report's student UID and user UID, and add error handling.
    
    report.remove(deleteCallback);
  });
};

var getReportById = function(reportUid, locals, queryCallback) {
  EventReport.findById(reportUid, (err, report) => {
    if (err) {
      queryCallback(err);
      return;
    }
    
    // If the report's student UID does not match the user UID, and the user is not an
    // admin, 'report' should not be returned.
    // TODO(jmtaber129): Check report's student UID and user UID, and add error handling.
    
    queryCallback(err, report);
  });
};

var getAllReports = function(reqData, locals, queryCallback) {
  conditions = {};
  
  // If the user is not an admin, limit the results to reports with the user's UID.  If
  // the user is not an admin, and one of the query parameters is a student UID other
  // than their own, handle it as an error.
  // TODO(jmtaber129): Set conditions.student to user UID for non-admins.
  // TODO(jmtaber129): Add error handling for requesting reports with student UIDs other
  // than the UID of a non-admin user.
  
  // TODO(jmtaber129): Set additional conditions once query parameters are accepted in
  // the request object.
  
  // Both report types are in the same collection, and querying a model queries the
  // entire collection, so querying one report model will return results for both report
  // types.
  EventReport.find(conditions, (err, reports) => {
    if (err) {
      queryCallback(err);
      return;
    }
    
    returnObject = {};
    
    reports.forEach((report) => {
      // TODO(jmtaber129): Check if the report's student UID matches the user UID, or if
      // the user is an admin.  Otherwise, return without adding the report to
      // 'returnObject'.
      
      returnObject[report.id] = report;
      
      // TODO(jmtaber129): Add point value to report in 'returnObject'.
    });
    
    queryCallback(err, returnObject);
  });
  
};

module.exports = { createReport, deleteReport, getReportById, getAllReports };