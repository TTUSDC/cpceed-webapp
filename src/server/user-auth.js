var dummyData = require('../../test/server/dummy-data.js')
var exports = module.exports = {};

exports.login = function(email, password) {
  return new Promise(function(resolve, reject) {
    if(dummyData.auth[email] == password && password){
      server._currentUser = dummyData.users[dummyData.emailToUid[email]]
      resolve(server._currentUser)
    }
    else reject(server.errorMessages.invalidLogin)
  })
}

exports.logout = function() {
  server._currentUser = null;
}

exports.getLoggedInUser = function(){
  return server._currentUser;
}
