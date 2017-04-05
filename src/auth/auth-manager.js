const jwt = require('jsonwebtoken');
const AuthUser = require('./auth-models').AuthUser;
const Session = require('./auth-models').Session;

/**
 * Callback for sending the response to the client.
 *
 * @function loginResponse
 * @param {(string|Object)} err - The error.
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
  AuthUser.findOne({ email: email }, (err, user) => {
    if (err) {
      next(err);
    } else if (!user) {
      next('Auth failed');
    } else {
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          next(err);
        } else {
          Session.findOne({ email: email }, (err, session) => {
            if (err) {
              next(err);
            } else if (session) {
              next(null, session.token);
            } else {
              // Create a JWT.
              const jwtData = { email: email, role: user.role };
              jwt.sign(jwtData, process.env.SECRET, { algorithm: 'HS256' }, (err, token) => {
                if (err) {
                  next(err);
                } else {
                  // Save the session to the DB.
                  const session = new Session({
                    email: email,
                    token: token
                  });
                  session.save((err) => { next(err, token); });
                }
              });
            }
          });
        }
      });
    }
  });
};

/**
 * Callback for sending the response to the client.
 *
 * @function logoutResponse
 * @param {(string|Object)} err - The error.
 * @param {string} err.message - The error message.
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
    if (err) {
      next(err);
    } else if (session) {
      session.remove(next);
    } else { next(); }
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
 * @function createResponse
 * @param {(string|Object)} err - The error.
 */

/**
 * Given an email/password, create an AuthUser.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {createResponse} next - The callback function to run after this function
  *     finishes.
 */
const create = (email, password, role,  next) => {
  var user = new AuthUser({
    email: email,
    password: password,
    role: role
  });

  AuthUser.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      next(err);
    } else if (existingUser) {
      next('Account with that email address already exists.');
    } else {
      user.save((err) => { next(err); });
    }
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

  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        next('Auth failed.');
      } else {
        Session.findOne({ email: decoded.email }, (err, session) => {
          if (err) {
            next(err);
          } else if (!session) {
            next('Auth failed.');
          } else {
            session.compareToken(token, (isMatch) => {
              if (!isMatch) {
                next('Auth failed.');
              } else {
                req.decoded = decoded;
                next();
              }
            });
          }
        });
      }
    });
  } else {
    next('No token provided.');
  }
};

module.exports = { create, login, logout, verify };
