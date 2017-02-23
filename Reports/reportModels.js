var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventReportSchema = new Schema({
    type: String,
    approvalStatus: String,
    student: String,
    event: String,
})

var otherReportSchema = new Schema({
    type: String,
    approvalStatus: String,
    student: String,
    category: String,
    datetime: String,
    location: String,
    title: String,
    description: String
})

var EventReport = mongoose.model('EventReport', eventReportSchema);

var OtherReport = mongoose.model('OtherReport', otherReportSchema);

module.exports = { EventReport, OtherReport };
