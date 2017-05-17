import * as utils from './utils';
import * as dummyData from '../../test/server/dummy-data';

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
