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
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
  };

  let user;

  if (data.role === 'Student') {
    // Create a student.
    info.studentId = data.studentId;
    user = new Student(info);
  } else if (data.role === 'Admin') {
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

var modifyUser = (userUid, reqData, modifyCallback) => {
  // TODO(ryanfaulkenberry100): Check if modifier is a user or an admin.
  if ( /*modifying user is student*/ true) {
    modifyUserAsSelf(userUid, reqData, modifyCallback);
  } else if ( /*modifying user is admin*/ false) {
    modifyUserAsAdmin(userUid, reqData, modifyCallback);
  } else {
    // TODO(ryanfaulkenberry100): Handle errors.
  }

  return new response.ResponseObject(200, { "url": "//www.google.com" });
  // TODO(ryanfaulkenberry100): Return actual data.
}

var deleteUser = (userUid) => {
  // TODO(ryanfaulkenberry100): Delete the specified user and remove console.log.
  console.log(userUid);

  return new response.ResponseObject(200, { "url": "//www.google.com" });
  // TODO(ryanfaulkenberry100): Return actual data.
}

var getUser = (userUid) => {
  // Returns a user.

  // TODO(ryanfaulkenberry100): Find the user and remove placeholder User variable.
  var User = new Admin({
    // Placeholder
    email: "nobody@gmail.com",
    firstName: "John",
    lastName: "Doe",
    role: "Admin",
  });

  return new response.ResponseObject(200, User);
  // TODO(ryanfaulkenberry100): Return actual data.
}

var modifyUserAsSelf = (userUid, reqData, modifyCallback) => {}
var modifyUserAsAdmin = (userUid, reqData, modifyCallback) => {}

module.exports = { createUser, modifyUser, deleteUser, getUser };
