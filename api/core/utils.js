const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

/**
 * If the new value is defined and non-null, returns the new value.  Otherwise,
 * returns the old value.
 * @param {T} newValue - A new value value that may or may not be defined and
 *     non-null.
 * @param {T} oldValue - A old value that is defined and non-null.
 * @return {T} The new value if it is defined and non-null.  The old value if
 *     the new value is undefined or null.
 * @template T
 */
const newIfPresent = (newValue, oldValue) => {
  if (newValue === undefined || newValue == null) {
    return oldValue;
  }
  return newValue;
};

/**
* Utility function to get a MongoClient collection instance from Mongoose.
* @param {string} connection - The mongoose connection.
* @param {string} name - The name of the collection.
* @returns {Promise<Object, Error>} - Resolves with the collection.
*/
async function getCollection(connection, name) {
  let output;

  try {
    output = await new Promise((resolve, reject) => {
      connection.db.collection(name, (err, coll) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(coll);
      });
    });
  } catch (err) {
    throw err;
  }

  return output;
}

/**
* Utility function to delete all sessions for a given user's email.
* @param {string} email - The user's email.
* @returns {Promise<Object, Error>} - Resolves with the number of sessions
* deleted.
*/
async function deleteSessionsByEmail(email) {
  let deleted;

  try {
    // Native MongoClient gets around lack of Session schema
    const coll = await getCollection(mongoose.connection, 'sessions');

    deleted = await new Promise((resolve, reject) => {
      coll.remove({ 'session.passport.user': email }, (err, num) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(num);
      });
    });
  } catch (err) {
    throw err;
  }

  return deleted;
}

/**
* Utility function to compare against a bcrypt'd password.
* @param {string} password - The password to be compared.
* @param {string} target - The target of comparison.
* @returns {Promise<boolean, Error>} - Resolves with a boolean indicating whether
* or not the password is a match.
*/
function comparePassword(password, target) {
  return bcrypt.compare(password, target);
}

module.exports = {
  newIfPresent,
  getCollection,
  deleteSessionsByEmail,
  comparePassword,
};
