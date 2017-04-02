import { store } from 'App';
import { updateUser, logoutUser } from 'redux/actions';
import * as firebase from 'firebase';
// import logger from 'logger/logger.js';

export function login(email, password) {
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
      const rootRef = firebase.database().ref();
      const userRef = rootRef.child(`users/${user.uid}`);
      userRef.once('value').then((snapshot) => {
        const userData = snapshot.val();
        userData.uid = user.uid;
        store.dispatch(updateUser(userData));
        resolve(snapshot.val());
      });
    }).catch((err) => {
      reject(err);
    });
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
