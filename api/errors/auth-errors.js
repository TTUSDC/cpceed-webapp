const errorConstructor = (message, statusCode) => {
  const error = new Error(message);
  error.status = statusCode;
  return error;
};

/*
 * Not Found: Could we not find something in the databases?
 */
const userNotFoundError = errorConstructor('User not found.', 400);

const sessionNotFoundError = errorConstructor('No session found.', 400);

/*
 * Invalid: Did the user give us something that was wrong?
 */
const invalidPasswordError = errorConstructor('Invalid password.', 401);

const invalidSessionError = errorConstructor('Invalid session token.', 401);

/*
 * Missing: Did the user forget to give us something?
 */
const missingTokenError = errorConstructor('Token not found.', 400);

const unauthorizedError = errorConstructor('Unauthorized.', 401);

module.exports = {
  userNotFoundError,
  sessionNotFoundError,
  invalidPasswordError,
  invalidSessionError,
  missingTokenError,
  unauthorizedError,
};
