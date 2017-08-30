const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/**
 * Determines whether the user has sessions in the database.
 * @param {string} email - The user's email.
 * @returns {Promise<boolean, Error>} - Resolves with a boolean indicating
 * existance of sessions.
 */
async function userHasSessions(email) {
  try {
    const store = new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24 * 14,
      collection: 'sessions',
      stringify: false,
    });

    const sessions = await new Promise((resolve, reject) => {
      store.collection.find({ 'session.passport.user': email }).toArray((err, docs) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(docs.length !== 0);
      });
    });

    return sessions;
  } catch (err) {
    throw err;
  }
}

module.exports = { userHasSessions };
