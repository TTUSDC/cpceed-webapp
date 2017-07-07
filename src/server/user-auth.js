import { store } from 'App.jsx';
import { updateUser, logoutUser } from 'redux/actions';
import Connection from 'server/core/connection';
// import logger from 'logger/logger';
import * as tokenManager from 'server/core/tokenmanager';
import { getUser } from './user.js';

/**
 * Attempt to login using email and password.
 * @param {String} email - The email address.
 * @param {String} password - The password.
 * @return {Promise<string, Error>} - Promise that resolves with the user's
 *                                    data or rejects with an error.
 */
export function login(email, password) {
  return new Promise((resolve, reject) => {
    const onSuccess = (res) => {
      tokenManager.saveToken(res.token);
      const userData = tokenManager.decode(res.token);
      userData.role = userData.role.toLowerCase();
      getUser(userData.id).then((user) => {
        // TODO(asclines): This is temp until getUser is setup
        store.dispatch(updateUser(user));
      });
      resolve(userData);
    };

    new Connection()
      .post()
      .auth()
      .data({ email, password })
      .call(onSuccess, reject);
  });
}

/**
 * Attempt to logout.
 * @return {Promise<string, Error>} - Promise that resolves as undefined or
 *                                    rejects with an error.
 */
export function logout() {
  return new Promise((resolve, reject) => {
    const onSuccess = () => {
      tokenManager.removeToken();
      store.dispatch(logoutUser());
      resolve();
    };

    new Connection()
      .del()
      .auth()
      .data({ token: tokenManager.getToken() })
      .call(onSuccess, reject);
  });
}
