// import logger from 'logger.js';
import Connection from 'server/core/connection';

import * as utils from './utils';
import * as dummyData from '../../test/server/dummy-data';

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
      .param({ uid })
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
export function create(newReport) {
  return new Promise((resolve, reject) => {
    const uid = utils.getRandomString();
    dummyData.reports[uid] = newReport;
    resolve(uid);
  });
}

export function modify(uid, updatedReport) {
  return new Promise((resolve, reject) => {
    dummyData.reports[uid] = updatedReport;
    resolve();
  });
}

export function remove(uid) {
  return new Promise((resolve, reject) => {
    dummyData.reports[uid] = undefined;
    resolve();
  });
}

export function getByUid(uid) {
  return new Promise((resolve, reject) => {
    resolve(dummyData.reports[uid]);
  });
}

export function getAll() {
  return new Promise((resolve, reject) => {
    resolve(dummyData.reports);
  });
}
