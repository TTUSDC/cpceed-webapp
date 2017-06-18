import logger from 'logger/logger';
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

export function modifyEvent(uid, updatedEvent) {
  return new Promise((resolve, reject) => {
    new Connection()
      .put()
      .events()
      .data(updatedEvent)
      .params({ uid })
      .token()
      .call(resolve, reject);
  });
}

export function removeEvent(uid) {
  return new Promise((resolve, reject) => {
    new Connection()
      .del()
      .events()
      .params({ uid })
      .token()
      .call(resolve, reject);
  });
}

export function getEvent(uid) {
  return new Promise((resolve, reject) => {
    new Connection()
      .get()
      .events()
      .params({ uid })
      .token()
      .call(resolve, reject);
  });
}

export function getAllEvents() {
  return new Promise((resolve, reject) => {
    new Connection()
      .get()
      .all()
      .events()
      .token()
      .call(resolve, reject);
  });
}
