var utils = require('./utils.js')
var exports = module.exports = {};

exports.create = function(newEvent){
  return new Promise(function(resolve, reject){
    var uid = utils.getRandomString();
    server.dummyData.events[uid] = newEvent;
    resolve(uid);
  })
}

exports.modify = function(uid, updatedEvent){
  return new Promise(function(resolve, reject){
    server.dummyData.events[uid] = updatedEvent;
    resolve();
  })
}

exports.delete = function(uid){
  return new Promise(function(resolve, reject){
    server.dummyData.events[uid] = undefined;
    resolve();
  })
}

exports.getByUid = function(uid){
  return new Promise(function(resolve, reject){
    resolve(server.dummyData.events[uid])
  })
}

exports.getAll = function(){
  return new Promise(function(resolve, reject){
    resolve(server.dummyData.events);
  })
}
