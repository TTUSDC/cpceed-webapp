var auth = require('./user-auth.js')
var reports = require('./reports.js')
var dummyData = require('./test/dummy-data.js')


server = {
  dummyData: dummyData,
  errorMessages: {
    invalidLogin: "Invalid user/password combination"
  },
  login: auth.login,
  logout: auth.logout,
  getLoggedInUser: auth.getLoggedInUser,
  createReport: reports.createReport
}
