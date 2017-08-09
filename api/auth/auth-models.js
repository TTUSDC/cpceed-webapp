const mongoose = require('mongoose');
const crypto = require('crypto');

// Set up session model.
const sessionSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    expires: '30d',
    default: Date.now,
  },
});

sessionSchema.methods.compareId = function compareId(id) {
  return id === this.id;
};

/* eslint-disable no-await-in-loop */

sessionSchema.statics.genId = async function genId() {
  let id;
  let isValid;

  // TODO(NilsG-S): Limit number of retries?
  do {
    try {
      id = await new Promise((resolve, reject) => {
        // TODO(NilsG-S): Make this string longer?
        crypto.randomBytes(32, (err, buf) => {
          if (err) {
            return reject(err);
          }

          return resolve(buf.toString('hex'));
        });
      });
    } catch (err) {
      throw err;
    }

    try {
      isValid = await this.findOne({ id }).exec().then((session) => {
        if (session) {
          return false;
        }

        // TODO(NilsG-S): Return id from here to break out of loop?
        return true;
      });
    } catch (err) {
      throw err;
    }
  } while (!isValid);

  return id;
};

/* eslint-enable no-await-in-loop */

const Session = mongoose.model('Session', sessionSchema);

module.exports = { Session };
