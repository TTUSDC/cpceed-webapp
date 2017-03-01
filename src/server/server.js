var auth = require('./user-auth.js')
var reports = require('./reports.js')

server = {
  errorMessages: {
    invalidLogin: "Invalid user/password combination"
  },
  login: auth.login,
  logout: auth.logout,
  getLoggedInUser: auth.getLoggedInUser,
  createReport: reports.create
}
