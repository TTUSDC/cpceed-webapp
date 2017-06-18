// import logger from 'logger/logger';
import Connection from 'server/core/connection';

export function createEvent(newEvent) {
  return new Promise((resolve, reject) => {
    new Connection()
      .post()
      .events()
      .data(newEvent)
      .token()
      .call(resolve, reject);
  });
}

export function modify(uid, updatedEvent) {
  return new Promise((resolve, reject) => {
    new Connection()
      .put()
      .events()
      .data(updatedEvent)
      .token()
      .call(resolve, reject);
  });
}

export function remove(uid) {
  return new Promise((resolve, reject) => {
    new Connection()
      .del()
      .events()
      .data({ uid })
      .token()
      .call(resolve, reject);
  });
}

export function getByUid(uid) {
  return new Promise((resolve, reject) => {
    new Connection()
      .get()
      .events()
      .data({ uid })
      .token()
      .call(resolve, reject);
  });
}

export function getAll() {
  return new Promise((resolve, reject) => {
    new Connection()
      .get()
      .all()
      .events()
      .token()
      .call(resolve, reject);
  });
}
