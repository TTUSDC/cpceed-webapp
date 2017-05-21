var app = {
  "extends": "airbnb",
  "env": {
    "mocha": true,
    "browser": true,
  },
  "plugins": ["chai-friendly"],
  "rules": {
    "chai-friendly/no-unused-expressions": 2,
    "import/no-extraneous-dependencies": 0,
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "jsx-quotes": [2, "prefer-single"],
  }
};

var api = {
  "extends": "airbnb",
  "env": {
    "mocha": true,
    "node": true,
  },
  "plugins": ["chai-friendly"],
  "rules": {
    "chai-friendly/no-unused-expressions": 2,
    "import/no-extraneous-dependencies": 0,
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "jsx-quotes": [2, "prefer-single"],
  }
};

module.exports = {
  app,
  api,
};
