var auth = require('./user-auth.js')
var reports = require('./reports.js')
var events = require('./events.js')

var dummyData = require('../../test/server/dummy-data.js')

server = {
  dummyData: dummyData,
  errorMessages: {
    invalidLogin: "Invalid user/password combination"
  },
  login: auth.login,
  logout: auth.logout,
  getLoggedInUser: auth.getLoggedInUser,

  createReport: reports.create,
  modifyReport: reports.modify,
  deleteReport: reports.delete,
  getReportByUid: reports.getByUid,
  getAllReports: reports.getAll,

  createEvent: events.create,
  modifyEvent: events.modify,
  deleteEvent: events.delete,
  getEventByUid: events.getByUid,
  getAllEvents: events.getAll
}
