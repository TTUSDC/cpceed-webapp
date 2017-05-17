module.exports = {
  "extends": "airbnb",
  "env": {
    "mocha": true,
    "node": true,
  },
  "plugins": ["chai-friendly"],
  "rules": {
    "no-unused-expressions": 0,
    "chai-friendly/no-unused-expressions": 2,
  }
};
