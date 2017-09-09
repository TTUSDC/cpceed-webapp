const passport = require('api/passport-config.js');

const authErrors = require('api/errors/auth-errors');
const User = require('api/users/user-models').User;
const utils = require('api/core/utils.js');

/**
 * Given a valid email/password, generates a session and returns the id.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<string, Error>} - Resolves with the session id, or
 * rejects with an error that contains a status code and a message.
 */
const login = async (req, res) => {
  try {
    const rawUser = await new Promise((resolve, reject) => {
      // Arguments come from passport-config.js callback.
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          reject(authErrors.errorConstructor(err.message, 400));
          return;
        }

        if (!user) {
          reject(authErrors.errorConstructor(info.message, 401));
          return;
        }

        req.logIn(user, (authErr) => {
          if (authErr) {
            reject(authErrors.errorConstructor(authErr.message, 400));
            return;
          }

          resolve(user);
        });
      })(req, res);
    });

    const output = {
      user: {
        uid: rawUser.id,
        email: rawUser.email,
        name: rawUser.name,
        role: rawUser.role,
      },
      expires: req.session.cookie.expires,
    };

    if (rawUser.role === 'student') {
      output.user.points = rawUser.points;
      output.user.isApproved = rawUser.isApproved;
    }

    return output;
  } catch (err) {
    throw err;
  }
};

/**
 * Delete a specific session from the database.
 * @param {Object} session - The client's session.
 * @returns {Promise<undefined, Error>} - Resolves, or rejects with an error.
 */
const logout = async (session) => {
  try {
    await new Promise((resolve, reject) => {
      // Delete the session from the DB.
      session.destroy((err) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  } catch (err) {
    throw err;
  }
};

/**
 * Delete all of user's sessions from database and change their password.
 * @param {string} email - The user's email address.
 * @param {string} storedPassword - The user's stored password.
 * @param {string} password - The user's old password.
 * @param {string} newPassword - The user's new password.
 * @returns {Promise<undefined, Error>} - resolves, or rejects with an error.
 */
const changePassword = async (email, storedPassword, password, newPassword) => {
  try {
    const isMatch = await utils.comparePassword(password, storedPassword);

    // The wrong password was provided.
    if (!isMatch) {
      throw authErrors.invalidPasswordError;
    }

    const conditions = { email };
    const update = { password: newPassword };
    const options = { new: true };

    await User.findOneAndUpdate(conditions, { $set: update }, options).exec();

    await utils.deleteSessionsByEmail(email);

    return;
  } catch (err) {
    throw err;
  }
};

/**
 * Delete all of user's sessions from database and change their email.
 * @param {string} email - The user's email address.
 * @param {string} storedPassword - The user's stored password.
 * @param {string} password - The user's old password.
 * @param {string} newEmail - The user's new email.
 * @returns {Promise<undefined, Error>} - resolves, or rejects with an error.
 */
const changeEmail = async (email, storedPassword, password, newEmail) => {
  try {
    const isMatch = await utils.comparePassword(password, storedPassword);

    // The wrong password was provided.
    if (!isMatch) {
      throw authErrors.invalidPasswordError;
    }

    const conditions = { email };
    const update = { email: newEmail };
    const options = { new: true };

    await User.findOneAndUpdate(conditions, { $set: update }, options).exec();

    await utils.deleteSessionsByEmail(email);

    return;
  } catch (err) {
    throw err;
  }
};

/**
 * Middleware to determine whether the session is verified.
 * For valid sessions, the next middleware is called.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - Invoke the next middleware or route.
 */
const verify = (req, res, next) => {
  // No user was retrieved, so no valid session exists. Inform the client.
  if (!req.user) {
    const message = authErrors.invalidSessionError.message;
    // Prevent execution of later middleware for efficiency and clarity.
    res.status(400).json({ message }).end();
    return;
  }

  next();
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
  let uid = req.user.id;
  if (!uid) {
    res.locals.err = authErrors.missingTokenError;
    next();
    return;
  }
  // TODO(NilsG-S): Why reference req.query when the id is known to be in req.user?
  // I'm pretty sure this won't ever do anything...
  if (req.query.uid) {
    if (req.user.role === 'admin') {
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
  changeEmail,
  login,
  logout,
  verify,
  validateUidPermissions,
};
