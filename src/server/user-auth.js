import { store } from 'App.jsx';
import { updateUser, logoutUser } from 'redux/actions';
import Connection from 'server/core/connection';
// import logger from 'logger/logger';
import * as connection from 'server/core/connection';
import * as tokenManager from 'server/core/tokenmanager';

export function login(email, password) {
  return new Promise((resolve, reject) => {
    const onSuccess = (res) => {
      tokenManager.saveToken(res.token);
      const userData = tokenManager.decode(res.token);
      userData.role = userData.role.toLowerCase();
      store.dispatch(updateUser(userData)); // TODO(asclines): This is temp until getUser is setup
      resolve(userData);
    };

    new Connection()
      .post()
      .auth()
      .data({ email, password })
      .call(onSuccess, reject);
  });
}

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
