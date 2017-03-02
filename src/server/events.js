var utils = require('./utils.js')
var exports = module.exports = {};

exports.create = function(newEvent){
  return new Promise(function(resolve, reject){
    var uid = utils.getRandomString();
    server.dummyData.events[uid] = newEvent;
    resolve(uid);
  })
}
