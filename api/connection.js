const mongoose = require('mongoose');
const mockgoose = require('mockgoose');

const mongoURL = process.env.MONGODB_URI || process.env.MONGOLAB_URI;
mongoose.Promise = global.Promise;

/**
 * Opens a connection from mongoose to the database, wrapping it with
 * mockgoose if `NODE_ENV` is 'test'.
 * @returns {Promise<undefined, Error>} - Resolves when connection is opened.
 */
function open() {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'test') {
      mockgoose(mongoose);
    }

    mongoose.connect(mongoURL, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

/**
 * Closes the connection from mongoose to the database, using `unmock` if
 * NODE_ENV is 'test'.
 * @returns {Promise<undefined, Error>} - Resolves when connection is closed.
 */
function close() {
  if (process.env.NODE_ENV === 'test') {
    return new Promise((resolve) => {
      mongoose.unmock(() => {
        resolve();
      });
    });
  }

  return mongoose.disconnect();
}

module.exports = { open, close };
