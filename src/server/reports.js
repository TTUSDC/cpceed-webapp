var dummyData = require('./test/dummy-data.js')
var utils = require('./utils.js')

var exports = module.exports = {};

exports.create = function(newReport){
  var uid = utils.getRandomString();
  dummyData.reports[uid] = newReport;
  return uid;
}
