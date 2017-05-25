import { store } from 'App';
import { updateUser, logoutUser } from 'redux/actions';
import * as firebase from 'firebase';
import logger from 'logger/logger';
import * as connection from 'server/connection';

export function login(email, password) {
  logger.info('Logging in');
  return new Promise((resolve, reject) => {
    const data = {
      email: 'alexander@clines.com',
      password: 'password1',
    }
    connection.post('/auth',data,
    (res) => {
      logger.info(`Then: ${res}`)
      logger.error(res);
      localStorage.setItem('sessiontoken', res.token); //localStorage.getItem('sessiontoken');
      resolve();
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
