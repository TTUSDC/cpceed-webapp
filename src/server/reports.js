var utils = require('./utils.js')
var exports = module.exports = {};

exports.create = function(newReport){
  return new Promise(function(resolve, reject){
    var uid = utils.getRandomString();
    server.dummyData.reports[uid] = newReport;
    resolve(uid);
  })
}

exports.modify = function(uid, updatedReport){
  return new Promise(function(resolve, reject){
    server.dummyData.reports[uid] = updatedReport;
    resolve()
  })
}

exports.delete = function(uid){
  return new Promise(function(resolve, reject){
    server.dummyData.reports[uid] = undefined;
    resolve();
  })
}

exports.getByUid = function(uid){
  return new Promise(function(resolve, reject){
    resolve(server.dummyData.reports[uid])
  })
}

exports.getAll = function(){
  return new Promise(function(resolve, reject){
    resolve(server.dummyData.reports)
  })
}
