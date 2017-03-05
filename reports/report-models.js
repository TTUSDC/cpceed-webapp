var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var options = {discriminatorKey: 'type'};

var reportSchema = new Schema({
      approvalStatus: Boolean,
      student: String,
    },
    options);

var eventReportSchema = new Schema({event: String}, options);

var otherReportSchema = new Schema({
      category: String,
      datetime: Date,
      location: String,
      title: String,
      description: String,
    },
    options);

var Report = mongoose.model('Report', reportSchema);

var EventReport = Report.discriminator('EventReport', eventReportSchema);

var OtherReport = Report.discriminator('OtherReport', otherReportSchema);

module.exports = {Report, EventReport, OtherReport};
