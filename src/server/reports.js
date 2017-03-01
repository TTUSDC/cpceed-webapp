var utils = require('./utils.js')
var exports = module.exports = {};

exports.createReport = function(newReport){
  return new Promise(function(resolve, reject){
    var uid = utils.getRandomString();
    server.dummyData.reports[uid] = newReport;
    resolve(uid);
  })
}

exports.modify = function(uid, updatedReport){
  server.dummyData.reports[uid] = updatedReport;
}
