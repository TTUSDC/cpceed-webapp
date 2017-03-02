import utils from './utils'
import * as dummyData from '../../test/server/dummy-data'

export function create(newEvent){
  return new Promise(function(resolve, reject){
    var uid = utils.getRandomString();
    dummyData.events[uid] = newEvent;
    resolve(uid);
  })
}

export function modify(uid, updatedEvent){
  return new Promise(function(resolve, reject){
    dummyData.events[uid] = updatedEvent;
    resolve();
  })
}

export function remove(uid){
  return new Promise(function(resolve, reject){
    dummyData.events[uid] = undefined;
    resolve();
  })
}

export function getByUid(uid){
  return new Promise(function(resolve, reject){
    resolve(dummyData.events[uid])
  })
}

export function getAll(){
  return new Promise(function(resolve, reject){
    resolve(dummyData.events);
  })
}
