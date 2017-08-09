const mongoose = require('mongoose');
const crypto = require('crypto');
const authErrors = require('api/errors/auth-errors');

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

  for (let i = 0; i < 10; i += 1) {
    try {
      id = await new Promise((resolve, reject) => {
        crypto.randomBytes(32, (err, buf) => {
          if (err) {
            return reject(err);
          }

          return resolve(buf.toString('hex'));
        });
      });

      isValid = await this.findOne({ id }).exec().then((session) => {
        if (!session) {
          return true;
        }

        return false;
      });

      if (isValid) {
        return id;
      }
    } catch (err) {
      throw err;
    }
  }

  throw authErrors.serverMaxRetriesError;
};

/* eslint-enable no-await-in-loop */

const Session = mongoose.model('Session', sessionSchema);

module.exports = { Session };
