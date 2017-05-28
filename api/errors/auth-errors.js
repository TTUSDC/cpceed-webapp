
/*
 * Not Found: Could we not find something in the databases?
 */
const userNotFoundError = new Error('User not found.');

const sessionNotFoundError = new Error('No session found.');

/*
 * Invalid: Did the user give us something that was wrong?
 */
const invalidPasswordError = new Error('Invalid password.');

const invalidSessionError = new Error('Invalid session token.');

/*
 * Missing: Did the user forget to give us something?
 */
const missingTokenError = new Error('Token not found.');

const unauthorizedError = new Error('Unauthorized.');

module.exports = {
  userNotFoundError,
  sessionNotFoundError,
  invalidPasswordError,
  invalidSessionError,
  missingTokenError,
  unauthorizedError,
};
