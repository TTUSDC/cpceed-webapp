import { store } from 'App.jsx';
import { updateUser, logoutUser } from 'redux/actions';
import logger from 'logger.js';
import * as connection from 'server/core/connection';
import * as tokenManager from 'server/core/tokenmanager';

export function login(email, password) {
  return new Promise((resolve, reject) => {
    const data = {
      email,
      password,
    };
    connection.post('/auth', data,
    (res) => {
      tokenManager.saveToken(res.token);
      const decoded = tokenManager.decode(res.token);
      const userData = decoded;
      userData.role = userData.role.toLowerCase();
      store.dispatch(updateUser(userData)); // TODO(asclines): This is temp until getUser is setup
      resolve(userData);
    }, reject);
  });
}

export function logout() {
  return new Promise((resolve, reject) => {
    const data = {
      token: tokenManager.getToken(),
    };

    connection.del('/auth', data,
    (res) => {
      tokenManager.removeToken();
      store.dispatch(logoutUser());
      resolve(res);
    }, reject);
  });
}
