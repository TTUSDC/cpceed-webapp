const utils = require('api/core/utils.js');

/**
 * Determines whether the user has sessions in the database.
 * @param {string} email - The user's email.
 * @returns {Promise<boolean, Error>} - Resolves with a boolean indicating
 * existance of sessions.
 */
async function userHasSessions(email) {
  try {
    const coll = await utils.getCollection(mongoose.connection, 'sessions');

    const sessions = await new Promise((resolve, reject) => {
      coll.find({ 'session.passport.user': email }).toArray((err, docs) => {
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
