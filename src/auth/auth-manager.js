const jwt = require('jsonwebtoken');
const AuthUser = require('./auth-models').AuthUser;
const Session = require('./auth-models').Session;

/**
 * Given a valid email/password, generates and returns a JWT.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {function} next - The callback function to run after this function
 *     finishes.
 */
const login = (email, password, next) => {
  AuthUser.findOne({ email: email }, (err, user) => {
    if (err) { next(err); }
    else if (!user) { next('Auth failed'); }
    else {
      user.comparePassword(password, (err, isMatch) => {
        if (err) { next(err); }
        else {
          // Create a JWT and return it to the client.
          var token = jwt.sign(user, process.env.SECRET, {
            expiresIn: 60*60*24
          });

          // TODO(the-pat): Save the token to mongoose


          next(null, token);
        }
      });
    }
  });
};

/**
 * Delete the user's JWT from the DB.
 * @param {string} email - The user's email address.
 * @param {function} next - The callback function to run after this function
 *     finishes.
 */
const logout = (email, next) => {
  // Delete the session from the DB.
  Session.findOne({ email: email }, (err, session) => {
    if (err) { next(err); }
    else if (session) {
      session.remove(next);
    }
    else { next(); }
  });
};

/**
 * Delete the user's JWT from the DB.
 * @param {string} email - The user's email address.
 * @param {string} newPassword - The user's new password.
 * @param {function} next - The callback function to run after this function
  *     finishes.
 */
const changePassword = (email, password, next) => {
  // TODO(the-pat): Update the user's password and regen the JWT.
  next();
}

/**
 * Given an email/password, create an AuthUser.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {function} next - The callback function to run after this function
  *     finishes.
 */
const create = (email, password, role,  next) => {
  var user = new AuthUser({
    email: email,
    password: password,
    role: role
  });

  AuthUser.findOne({ email: email }, (err, existingUser) => {
    if (err) { next(err); }
    else if (existingUser) {
      next('Account with that email address already exists.');
    }
    else { user.save((err) => { next(err); }); }
  });
};

/**
 * Verify the JWT.
 * @param {Object} req - The request object.
 * @param {Obeject} res - The response object.
 * @param {function} next - The callback function to run after this function
 *     finishes.
 */
const verify = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Auth failed.' });
      }
      else {
        Session.findOne({ email: decoded.email }, (err, session) => {
          if (err) { next(err); }
          else {
            session.compareTokens(decoded.token, (isMatch) => {
              if (isMatch) { return res.status(401).json({ message: 'Auth failed.' }); }
              else {
                req.decoded = decoded;
                next();
              }
            });
          }
        });
      }
    });
  }
  else {
    return res.status(403).send({ message: 'No token provided.' });
  }
};

module.exports = { login, logout, create, verify };
