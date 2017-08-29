const mongoose = require('mongoose');
const mockgoose = require('mockgoose');

const mongoURL = process.env.MONGODB_URI || process.env.MONGOLAB_URI;
mongoose.Promise = global.Promise;

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

function close() {
  return mongoose.disconnect();
}

module.exports = { open, close };
