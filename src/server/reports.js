import utils from './utils'
import * as dummyData from '../../test/server/dummy-data'

//var utils = require('./utils.js')

export function create(newReport){
  return new Promise(function(resolve, reject){
    var uid = utils.getRandomString();
    dummyData.reports[uid] = newReport;
    resolve(uid);
  })
}

export function modify(uid, updatedReport){
  return new Promise(function(resolve, reject){
    dummyData.reports[uid] = updatedReport;
    resolve();
  })
}

export function remove(uid){
  return new Promise(function(resolve, reject){
    dummyData.reports[uid] = undefined;
    resolve();
  })
}


export function getByUid(uid){
  return new Promise(function(resolve, reject){
    resolve(dummyData.reports[uid])
  })
}

export function getAll(){
  return new Promise(function(resolve, reject){
    resolve(dummyData.reports)
  })
}
