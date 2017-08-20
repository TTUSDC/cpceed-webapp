const bcrypt = require('bcrypt');

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
  comparePassword,
};
