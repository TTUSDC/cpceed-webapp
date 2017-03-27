import * as firebase from 'firebase';

export function login(email, password) {
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
      const ref = firebase.database().ref().child(`users/${user.uid}/role`);
      ref.once('value').then((snapshot) => {
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
