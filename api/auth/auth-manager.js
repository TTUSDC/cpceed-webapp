const jwt = require('jsonwebtoken');
const authErrors = require('../errors/auth-errors');
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
      next(authErrors.userNotFoundError);
      return;
    }

    user.comparePassword(password, (passwordErr, isMatch) => {
      if (passwordErr) {
        next(passwordErr);
        return;
      }

      // The wrong password was provided.
      if (!isMatch) {
        next(authErrors.invalidLoginInfoError);
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
          id: user.id,
        };

        // Sign and save the session.
        jwt.sign(jwtData, process.env.SECRET, { algorithm: 'HS512' }, (signErr, token) => {
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
      session.compareToken(token, (isMatch) => {
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
