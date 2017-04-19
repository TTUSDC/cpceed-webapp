const jwt = require('jsonwebtoken');
const User = require('../users/user-models').User;
const Session = require('./auth-models').Session;

/**
 * Callback for sending the response to the client.
 *
 * @callback loginResponse
 * @param {Object} err - The error.
 * @param {string} token - The JWT token.
 */

/**
 * Given a valid email/password, generates and returns a JWT.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {loginResponse} next - The callback function to run after this function
 *     finishes.
 */
const login = (email, password, next) => {
  User.findOne({ email }, (findErr, user) => {
    if (findErr) {
      next(findErr);
      return;
    }

    // No user found for the given email address.
    if (!user) {
      next('User not found.');
      return;
    }

    user.comparePassword(password, (passwordErr, isMatch) => {
      if (passwordErr) {
        next(passwordErr);
        return;
      }

      // The wrong password was provided.
      if (!isMatch) {
        next('Wrong password provided.');
        return;
      }

      Session.findOne({ email }, (sessionErr, session) => {
        // If a session token exists, return the session token.
        if (sessionErr || session) {
          next(sessionErr, session.token);
          return;
        }

        // If no session currently exists, create a new session.
        const jwtData = {
          email,
          role: user.role,
          isApproved: user.isApproved,
        };

        // Sign and save the session.
        jwt.sign(jwtData, process.env.SECRET, { algorithm: 'HS256' }, (signErr, token) => {
          if (signErr) {
            next(signErr);
            return;
          }

          const newSession = new Session({ email, token });
          newSession.save((saveErr) => { next(saveErr, token); });
        });
      });
    });
  });
};

/**
 * Callback for sending the response to the client.
 *
 * @callback logoutResponse
 * @param {Object} err - The error.
 * @param {string} err.err - The error message.
 */

/**
 * Delete the user's JWT from the DB.
 * @param {string} email - The user's email address.
 * @param {logoutResponse} next - The callback function to run after this function
 *     finishes.
 */
const logout = (email, next) => {
  // Delete the session from the DB.
  Session.findOneAndRemove({ email }, (err) => { next(err); });
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
  if (!token) { throw new Error('No token provided.'); }

  // Verify the client token has a valid signature.
  jwt.verify(token, process.env.SECRET, (verifyErr, decoded) => {
    if (verifyErr) { throw new Error(verifyErr); }

    // Verify that the session is current.
    Session.findOne({ email: decoded.email }, (sessionErr, session) => {
      if (sessionErr) { throw new Error(sessionErr); }

      // If no session is found, then the user was logged out of their account.
      if (!session) { throw new Error('No session found.'); }

      // Verify that the stored token and the client token are the same.
      session.compareToken(token, (isMatch) => {
        // The token is expired.
        if (!isMatch) { throw new Error('Expired session provided.'); }

        // Add the token information to `res.locals.auth`.
        res.locals.auth = decoded;
        next();
      });
    });
  });
};

module.exports = { changePassword, login, logout, verify };
