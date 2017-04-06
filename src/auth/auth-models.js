const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Set up session model.
const sessionSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  token: {
    type: String,
    required: true
  }
});

sessionSchema.methods.compareToken = function (token, next) {
  next(token === this.token);
};

const Session = mongoose.model('Session', sessionSchema);

module.exports = { Session };
