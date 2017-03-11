import * as auth from './user-auth'
import * as reports from './reports'
import * as events from './events'
import * as dummyData from '../../test/server/dummy-data'
import errorMessages from './error-messages'

let server = {
  dummyData: dummyData,
  errorMessages: errorMessages,
  login: auth.login,
  logout: auth.logout,
  getLoggedInUser: auth.getLoggedInUser,

  createReport: reports.create,
  modifyReport: reports.modify,
  deleteReport: reports.remove,
  getReportByUid: reports.getByUid,
  getAllReports: reports.getAll,

  createEvent: events.create,
  modifyEvent: events.modify,
  deleteEvent: events.remove,
  getEventByUid: events.getByUid,
  getAllEvents: events.getAll
}

export default server;
