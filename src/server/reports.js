// import logger from 'logger.js';
import Connection from 'server/core/connection';

export function createReport(newReport) {
  return new Promise((resolve, reject) => {
    new Connection()
      .post()
      .reports()
      .data(newReport)
      .token()
      .call(resolve, reject);
  });
}

export function modifyReport(uid, updatedReport) {
  return new Promise((resolve, reject) => {
    new Connection()
      .put()
      .reports()
      .data(updatedReport)
      .params({ uid })
      .token()
      .call(resolve, reject);
  });
}

export function removeReport(uid) {
  return new Promise((resolve, reject) => {
    new Connection()
      .del()
      .reports()
      .params({ uid })
      .token()
      .call(resolve, reject);
  });
}

export function getReport(uid) {
  return new Promise((resolve, reject) => {
    new Connection()
      .get()
      .reports()
      .params({ uid })
      .token()
      .call(resolve, reject);
  });
}

export function getAllReports() {
  return new Promise((resolve, reject) => {
    new Connection()
      .get()
      .all()
      .reports()
      .token()
      .call(resolve, reject);
  });
}
