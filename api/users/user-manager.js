const userModels = require('./user-models.js');

const User = userModels.User;
const Student = userModels.Student;
const Admin = userModels.Admin;

/**
 * Callback for {@link createUser}
 * @typedef {Object} CreateUserCallback
 * @param {Object} err - The error.
 * @param {Number} id - The user UID.
 */

/**
 * Given User information, create a User.
 * @param {Object} data - The request body data.
 * @param {String} data.role - The user role.
 * @param {String} data.email - The user email address.
 * @param {String} data.password - The user password.
 * @param {CreateUserCallback} next - The callback function to run after this function
 *     finishes.
 */
const createUser = (data, next) => {
  // Ensure the required data is available.
  if (!data) {
    next({ err: 'Required parameters not found.' });
    return;
  }

  const info = {
    email: data.email,
    password: data.password,
    name: data.name,
    role: data.role,
  };

  let user;

  if (data.role === 'student') {
    // Create a student.
    info.studentId = data.studentId;
    user = new Student(info);
  } else if (data.role === 'admin') {
    // Create an admin.
    user = new Admin(info);
  } else {
    next({ err: 'Valid role not found.' });
    return;
  }

  User.findOne({ email: user.email }, (userErr, existingUser) => {
    if (userErr) {
      next(userErr);
    } else if (existingUser) {
      next({ err: 'Account with that email address already exists.' });
    } else {
      user.save((saveErr, dbUser) => {
        next(saveErr, (dbUser || {}).id);
      });
    }
  });
};

/**
* Callback for {@link modifyUser}
* @typedef {Object} ModifyUserCallback
* @param {Object} - The error
* @param {UserSchema} - The modified user object
*/


 /**
 * Updates the user with the passed in values.
 * This method does NOT delete fields
 * @param {string} userUid - The UID of the user to be updated
 * @param {Object} reqData - The request data
 * @param {Object} locals
 * @param {ModifyUserCallback} modifyCallback
 */
const modifyUser = (userUid, reqData, locals, modifyCallback) => {
  const conditions = { _id: userUid };
  const update = {};

  Object.keys(reqData).forEach((key) => {
    update[key] = reqData[key];
  });

  const options = { new: true };

  Student.findOneAndUpdate(conditions, { $set: update }, options, modifyCallback);
};

/**
* Callback for {@link deleteUser}
* @typedef {Object} DeleteUserCallback
* @param {Object} - error
*/



/**
* Deletes the user from the database.
* @param {string} userUid - The UID of the user to be updated.
* @param {Object} locals
* @param {DeleteUserCallback} deleteCallback
*/
const deleteUser = (userUid, locals, deleteCallback) => {
  User.findOneAndremove({ _id: userUid }, deleteCallback);
};


/**
* Callback for {@link getUserById}
* @typedef {Object} GetUserCallback
* @param {Object} - error
* @param {UserSchemas} - Retrieved user
*/

/**
* Retrieves the user.
* @param {string} userUid - The UID of the user to be updated
* @param {Object} locals
* @param {GetUserCallback} queryCallback
*/
const getUserById = (userUid, locals, queryCallback) => {
  User.findById(userUid, (err, results) => {
    if (err) {
      queryCallback(err);
      return;
    }
    const user = {
      uid: results.id,
      email: results.email,
      name: results.name,
      role: results.role,
    };

    if (user.role === 'student') {
      user.points = results.points;
      user.isApproved = results.isApproved;
    }

    queryCallback(err, user);
  });
};


module.exports = { createUser, modifyUser, deleteUser, getUserById };
