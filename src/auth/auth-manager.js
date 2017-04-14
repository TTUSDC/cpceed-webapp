const jwt = require('jsonwebtoken');
const User = require('../users/user-models').User;
const Session = require('./auth-models').Session;

/**
 * Callback for sending the response to the client.
 *
 * @function loginResponse
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
  User.findOne({ email: email }, (err, user) => {
    if (err || !user) {
      next(err || { err: "Auth failed." });
      return;
    }

    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        next(err);
        return;
      }

      Session.findOne({ email: email }, (err, session) => {
        if (err || session) {
          next(err, session.token);
          return;
        }

        // Create a JWT.
        const jwtData = {
          email: email,
          role: user.role,
          isApproved: user.isApproved
        };

        // Sign and save the session.
        jwt.sign(jwtData, process.env.SECRET, { algorithm: 'HS256' }, (err, token) => {
          const session = new Session({
            email: email,
            token: token
          });
          session.save((err) => { next(err, token); });
        });
      });
    });
  });
};

/**
 * Callback for sending the response to the client.
 *
 * @function logoutResponse
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
  Session.findOne({ email: email }, (err, session) => {
    if (err || !session) {
      next(err);
      return;
    }
    session.remove(next);
  });
};

/**
 * Callback for sending the response to the client.
 *
 * @function changePasswordResponse
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
}

/**
 * Callback for sending the response to the client.
 *
 * @function approveResponse
 * @param {(string|Object)} err - The error.
 */

/**
 * Given an email, approve a User.
 * @param {string} email - The user's email address.
 * @param {approveResponse} next - The callback function to run after this function
  *     finishes.
 */
const approve = (email, next) => {
  AuthUser({email: email}, (err, user) => {
    if (err) {
      next(err);
      return;
    }

    user.isApproved = true;
    user.save((err) => { next(err); });
  });
};

/**
 * Middleware to verify the JWT.
 * For valid tokens, a `decoded` object is added to the request object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - Invoke the next middleware or route.
 */
const verify = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    next({ err: 'No token provided.' });
    return;
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      next('Auth failed.');
      return;
    }

    Session.findOne({ email: decoded.email }, (err, session) => {
      if (err || !session)  {
        next(err || { err: "Auth failed." });
        return;
      }

      session.compareToken(token, (isMatch) => {
        if (!isMatch) {
          next({ err: 'Auth failed.' });
          return;
        }
        req.local = decoded;
        next();
      });
    });
  });
};

module.exports = { approve, login, logout, verify };
