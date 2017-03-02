import * as dummyData from '../../test/server/dummy-data'
import {errorMessages}  from './error-messages'

var _currentUser = undefined;
export function login(email, password){
  return new Promise(function(resolve, reject) {
    if(dummyData.auth[email] == password && password){
      _currentUser = dummyData.users[dummyData.emailToUid[email]]
      resolve(_currentUser)
    }
    else reject(errorMessages.invalidLogin)
  })
}

export function logout() {
  _currentUser = null;
}

export function getLoggedInUser() {
  return _currentUser;
}
