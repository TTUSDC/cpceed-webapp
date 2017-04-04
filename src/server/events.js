import logger from 'logger/logger';
import * as firebase from 'firebase';
import * as dummyData from '../../test/server/dummy-data';

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
    resolve(dummyData.events[uid]);
  });
}

export function getAll() {
  return new Promise((resolve, reject) => {
    resolve(dummyData.events);
  });
}
