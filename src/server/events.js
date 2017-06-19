// import logger from 'logger.js';
import * as firebase from 'firebase';

const eventsRef = firebase.database().ref().child('events');

export function create(newEvent) {
  return new Promise((resolve, reject) => {
    const newEventRef = eventsRef.push();
    newEventRef.set(newEvent).then((err) => {
      if (err) reject(err);
      resolve(newEventRef.key);
    });
  });
}

export function modify(uid, updatedEvent) {
  return new Promise((resolve, reject) => {
    const updatedEventRef = eventsRef.child(uid);
    updatedEventRef.set(updatedEvent).then((err) => {
      if (err) reject(err);
      resolve(updatedEventRef.key);
    });
  });
}

export function remove(uid) {
  return new Promise((resolve, reject) => {
    const removeEventRef = eventsRef.child(uid);
    removeEventRef.remove().then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
}

export function getByUid(uid) {
  return new Promise((resolve, reject) => {
    const getEventRef = eventsRef.child(uid);
    getEventRef.once('value').then((snapshot) => {
      resolve(snapshot.val());
    }).catch((err) => { reject(err); });
  });
}

export function getAll() {
  return new Promise((resolve, reject) => {
    eventsRef.once('value').then((snapshot) => {
      resolve(snapshot.val());
    }).catch((err) => { reject(err); });
  });
}
