const mongoose = require('mongoose');

const authErrors = require('api/errors/auth-errors');
const User = require('api/users/user-models').User;
const comparePassword = require('api/core/utils.js').comparePassword;

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
    const isMatch = await comparePassword(password, storedPassword);

    // The wrong password was provided.
    if (!isMatch) {
      throw authErrors.invalidPasswordError;
    }

    await new Promise((resolve, reject) => {
      // Native MongoClient gets around lack of Session schema
      mongoose.connection.db.collection('sessions', (collErr, coll) => {
        if (collErr) {
          reject(collErr);
          return;
        }

        coll.remove({ 'session.passport.user': email }, (err, num) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(num);
        });
      });
    });

    const conditions = { email };
    const update = { password: newPassword };
    const options = { new: true };

    await User.findOneAndUpdate(conditions, { $set: update }, options).exec();

    return;
  } catch (err) {
    throw err;
  }
};

/**
 * Delete all of user's sessions from database and change their email.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's old password.
 * @param {string} newEmail - The user's new email.
 * @returns {Promise<undefined, Error>} - resolves, or rejects with an error.
 */
const changeEmail = async (email, password, newEmail) => {
  try {
    const user = await User.findOne({ email }).exec();

    // No user found for the given email address.
    if (!user) {
      throw authErrors.userNotFoundError;
    }

    const isMatch = await user.comparePassword(password);

    // The wrong password was provided.
    if (!isMatch) {
      throw authErrors.invalidPasswordError;
    }

    await Session.deleteMany({ email });

    const conditions = { email };
    const update = { email: newEmail };
    const options = { new: true };

    await User.findOneAndUpdate(conditions, { $set: update }, options).exec();

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
  // TODO(NilsG-S): Why reference req.query when the uid is known to be in res.locals?
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
  logout,
  verify,
  validateUidPermissions,
};
