const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const options = { discriminatorKey: 'type' };

const reportSchema = new Schema({
  approvalStatus: Boolean,
  student: String,
},
    options);

const eventReportSchema = new Schema({ event: String }, options);

const otherReportSchema = new Schema({
  category: String,
  datetime: Date,
  location: String,
  title: String,
  description: String,
},
    options);

const Report = mongoose.model('Report', reportSchema);

const EventReport = Report.discriminator('EventReport', eventReportSchema);

const OtherReport = Report.discriminator('OtherReport', otherReportSchema);

module.exports = { Report, EventReport, OtherReport };
