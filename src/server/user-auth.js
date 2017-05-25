import { store } from 'App';
import { updateUser, logoutUser } from 'redux/actions';
import * as firebase from 'firebase';
import logger from 'logger/logger';
import * as connection from 'server/core/connection';
import * as tokenManager from 'server/core/tokenmanager';

export function login(email, password) {
  logger.info('Logging in');
  return new Promise((resolve, reject) => {
    const data = {
      email: 'alexander@clines.com',
      password: 'password1',
    }
    connection.post('/auth',data,
    (res) => {
      tokenManager.saveToken(res.token);
      const decoded = tokenManager.decode(res.token);
      const userData = decoded;
      userData.role = userData.role.toLowerCase();
      store.dispatch(updateUser(userData));
      resolve(userData);
    },reject);
  });
}

export function logout() {
  return new Promise((resolve, reject) => {
    firebase.auth().signOut().then(() => {
      store.dispatch(logoutUser());
      resolve();
    }).catch((err) => { reject(err); });
  });
}
