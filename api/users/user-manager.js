const response = require('../objects/response.js');
const userModels = require('./user-models.js');

const User = userModels.User;
const Student = userModels.Student;
const Admin = userModels.Admin;

/**
 * Callback for sending the response to the client.
 *
 * @callback createResponse
 * @param {Object} err - The error.
 * @param {Number} id - The user UID.
 */

/**
 * Given User information, create a User.
 * @param {Object} data - The request body data.
 * @param {String} data.role - The user role.
 * @param {String} data.email - The user email address.
 * @param {String} data.password - The user password.
 * @param {createResponse} next - The callback function to run after this function
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

/*
 * The fields that can be updated are:
 * - email
 * - name
 */
const modifyUser = (userUid, reqData, locals, modifyCallback) => {
  const conditions = { _id: userUid };
  let update = {};
  if (locals.auth.role === 'admin') {
    update = {
      $set: {
        email: reqData.email,
        name: reqData.name,
      },
    };
  } else {
    update = {
      $set: {
        email: reqData.email,
        name: reqData.name,
        points: reqData.points,
        isApproved: reqData.isApproved,
      },
    };
  }

  const options = {
    new: true,
  };

  User.findOneAndUpdate(conditions, update, options, modifyCallback);
};

var deleteUser = (userUid) => {
  // TODO(ryanfaulkenberry100): Delete the specified user and remove console.log.
  console.log(userUid);

  return new response.ResponseObject(200, { "url": "//www.google.com" });
  // TODO(ryanfaulkenberry100): Return actual data.
}

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
