var exports = module.exports = {};

exports.getRandomString = function(){
  return Math.random().toString(36).substring(7);

}
