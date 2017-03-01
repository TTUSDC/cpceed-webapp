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
  
}

module.exports = { createReport };