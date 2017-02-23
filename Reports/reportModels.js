var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventReportSchema = new Schema({
    type: String,
    approvalStatus: Boolean,
    student: String,
    event: String,
})

var otherReportSchema = new Schema({
    type: String,
    approvalStatus: Boolean,
    student: String,
    category: String,
    datetime: Date,
    location: String,
    title: String,
    description: String
})

var EventReport = mongoose.model('EventReport', eventReportSchema);

var OtherReport = mongoose.model('OtherReport', otherReportSchema);

module.exports = { EventReport, OtherReport };
