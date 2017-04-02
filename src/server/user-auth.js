import { store } from 'App';
import { updateUser } from 'redux/actions';
import * as firebase from 'firebase';
import logger from 'logger/logger.js';

export function login(email, password) {
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
      const rootRef = firebase.database().ref();
      const userRef = rootRef.child(`users/${user.uid}`);
      userRef.once('value').then((snapshot) => {
        store.dispatch(updateUser(snapshot.val()));
        logger.info(snapshot.val());
        resolve(snapshot.val());
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

export function logout() {
  return firebase.auth().signOut();
}

export function getLoggedInUser() {
  return firebase.auth().currentUser;
}
