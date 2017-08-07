const jwt = require('jsonwebtoken');
const authErrors = require('api/errors/auth-errors');
const User = require('api/users/user-models').User;
const Session = require('api/auth/auth-models').Session;

/**
 * Given a valid email/password, generates and returns a token (session id).
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<string, Error>} - Resolves with the token, or rejects.
 */
const login = async (email, password) => {
  try {
    const user = await User.findOne({ email }).exec();

    // No user found for the given email address.
    if (!user) {
      throw authErrors.userNotFoundError;
    }

    const isMatch = await user.comparePassword(password);

    // The wrong password was provided.
    if (!isMatch) {
      throw authErrors.invalidLoginInfoError;
    }

    const id = await Session.genId();

    const newSession = new Session({ id, email });
    await newSession.save();

    return id;
  } catch (err) {
    throw err;
  }
};

/**
 * Callback for sending the response to the client.
 *
 * @callback logoutResponse
 * @param {Object} err - The error.
 * @param {string} err.err - The error message.
 */

/**
 * Delete a specific session from the database.
 * @param {string} token - The client's token.
 * @param {logoutResponse} next - The callback function to run after this function
 *     finishes.
 */
const logout = (token, next) => {
  // Delete the session from the DB.
  Session.findOneAndRemove({ id: token }, (err) => { next(err); });
};

/**
 * Callback for sending the response to the client.
 *
 * @callback changePasswordResponse
 */

/**
 * Delete the user's JWT from the DB.
 * @param {string} email - The user's email address.
 * @param {string} newPassword - The user's new password.
 * @param {changePasswordResponse} next - The callback function to run after this function
  *     finishes.
 */
const changePassword = (email, password, next) => {
  // TODO(the-pat): Update the user's password and regen the JWT.
  next();
};

/**
 * Middleware to verify the JWT.
 * For valid tokens, an `auth` object is added to the response.locals object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - Invoke the next middleware or route.
 */
const verify = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  // If no token is provided, inform the client.
  if (!token) {
    res.locals.err = new Error(authErrors.missingTokenError);
    next();
    return;
  }

  // Verify the client token has a valid signature.
  jwt.verify(token, process.env.SECRET, (verifyErr, decoded) => {
    if (verifyErr) {
      res.locals.err = new Error(verifyErr);
      next();
      return;
    }

    // Verify that the session is current.
    Session.findOne({ email: decoded.email }, (sessionErr, session) => {
      if (sessionErr) {
        res.locals.err = new Error(sessionErr);
        next();
        return;
      }

      // If no session is found, then the user was logged out of their account.
      if (!session) {
        res.locals.err = new Error(authErrors.sessionNotFoundError);
        next();
        return;
      }

      // Verify that the stored token and the client token are the same.
      session.compareId(token, (isMatch) => {
        // The token is expired.
        if (!isMatch) {
          res.locals.err = new Error(authErrors.invalidSessionError);
          next();
          return;
        }

        // Add the token information to `res.locals.auth`.
        res.locals.auth = decoded;
        next();
      });
    });
  });
};

/*
 * Middleware to verify the user has access permissions of some document.
 * For valid tokens, an `uid` object is added to the response.locals object.
 * The `uid` object is the uid of the owner of the document being accessed.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - Invoke the next middleware or route.
 */
const validateUidPermissions = (req, res, next) => {
  let uid = res.locals.auth.id;
  if (!uid) {
    res.locals.err = authErrors.missingTokenError;
    next();
    return;
  }
  if (req.query.uid) {
    if (res.locals.auth.role === 'admin') {
      uid = req.query.uid;
    } else if (req.query.uid !== uid) {
      res.locals.err = authErrors.unauthorizedError;
      console.log('Unauthorized');
      next(authErrors.unauthorizedError);
      return;
    }
  }
  res.locals.uid = uid;
  next();
};

module.exports = {
  changePassword,
  login,
  logout,
  verify,
  validateUidPermissions,
};
