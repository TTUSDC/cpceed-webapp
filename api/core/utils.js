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

module.exports = {
  newIfPresent,
};
