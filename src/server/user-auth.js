import * as dummyData from '../../test/server/dummy-data';
import * as errorMessages from './error-messages';

let _currentUser;

export function login(email, password) {
  return new Promise((resolve, reject) => {
    if (dummyData.auth[email] === password && password) {
      _currentUser = dummyData.users[dummyData.emailToUid[email]];
      resolve(_currentUser);
    } else {
      reject(errorMessages.invalidLogin);
    }
  });
}

export function logout() {
  _currentUser = null;
}

export function getLoggedInUser() {
  return _currentUser;
}
