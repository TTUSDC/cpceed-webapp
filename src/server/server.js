var auth = require('./user-auth.js')
server = {
  errorMessages: {
    invalidLogin: "Invalid user/password combination"
  },
  login: function(email, password) {
    return auth.login(email, password);
  },
  logout: function(){
    return auth.logout();
  },
  getLoggedInUser: function(){
    return auth.getLoggedInUser();
  }
}
