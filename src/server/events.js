import * as util from './utils';
import * as dummyData from '../../test/server/dummy-data';

export function create(newEvent) {
  return new Promise((resolve, reject) => {
    const uid = util.getRandomString();
    dummyData.events[uid] = newEvent;
    resolve(uid);
  });
}

export function modify(uid, updatedEvent) {
  return new Promise((resolve, reject) => {
    dummyData.events[uid] = updatedEvent;
    resolve();
  });
}

export function remove(uid) {
  return new Promise((resolve, reject) => {
    dummyData.events[uid] = undefined;
    resolve();
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
