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
    "browser": true,
    "import/no-extraneous-dependencies": 0,
    "import/extensions": 0,
    "import/no-unresolved": 0,
  }
};
