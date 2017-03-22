module.exports = {
  "extends": "airbnb",
  "env": {
    "mocha": true,
    "node": true,
    "browser": true,
  },
  "plugins": ["chai-friendly"],
  "rules": {
    "chai-friendly/no-unused-expressions": 2,
  }
};
