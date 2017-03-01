var auth = require('./user-auth.js')
server = {
  errorMessages: {
    invalidLogin: "Invalid user/password combination"
  },
  login: auth.login,
  logout: auth.logout,
  getLoggedInUser: auth.getLoggedInUser
}
