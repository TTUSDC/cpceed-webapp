var response = require('../Objects/response.js');
var userModels = require('./user-models.js');
var Student = userModels.Student;
var Admin = userModels.Admin;

/**
 * Callback for sending the response to the client.
 *
 * @function createResponse
 * @param {Object} err - The error.
 * @param {Number} id - The student ID.
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
  if (!data || !data.role || !data.email || !data.password ||
      (data.role === 'Student' && !data.studentId)) {
    next({ err: 'Required parameters not found.' });
    return;
  }

  switch (data.role) {
    case "Student":
      // Create a student
      const user = new Student({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        studentId: data.studentId
      });

      // Search for possible duplicate student.
      Student.findOne({ email: user.email, studentId: user.studentId }, (err, existingUser) => {
        if (err) {
          next(err);
          return;
        }

        if (existingUser) {
          next({ err: 'Account with that email address or student id already exists.' });
        } else {
          user.save((err) => { next(err, user.studentId); });
        }
      });
      break;
    case "Admin":
      // Create an admin
      const user = new Admin({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      });

      // Search for possible duplicate admin.
      Admin.findOne({ email: user.email }, (err, existingUser) => {
        if (err) {
          next(err);
          return;
        }

        if (existingUser) {
          next({ err: 'Account with that email address or student id already exists.' });
        } else {
          // TODO(ryanfaulkenberry100): Does the admin need an ID?
          user.save((err) => { next(err); });
        }
      });
      break;
  }
};

var modifyUser = (userUid, reqData, modifyCallback) => {
  // TODO(ryanfaulkenberry100): Check if modifier is a user or an admin.
  if (/*modifying user is student*/ true) {
    modifyUserAsSelf(userUid, reqData, modifyCallback);
  } else if (/*modifying user is admin*/ false) {
    modifyUserAsAdmin(userUid, reqData, modifyCallback);
  } else {
    // TODO(ryanfaulkenberry100): Handle errors.
  }

  return new response.ResponseObject(200, {"url":"//www.google.com"});
  // TODO(ryanfaulkenberry100): Return actual data.
}

var deleteUser = (userUid) => {
  // TODO(ryanfaulkenberry100): Delete the specified user and remove console.log.
  console.log(userUid);

  return new response.ResponseObject(200, {"url":"//www.google.com"});
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
    role: "Admin"
  });

  return new response.ResponseObject(200, User);
  // TODO(ryanfaulkenberry100): Return actual data.
}

var modifyUserAsSelf = (userUid, reqData, modifyCallback) => {}
var modifyUserAsAdmin = (userUid, reqData, modifyCallback) => {}

module.exports = { createUser, modifyUser, deleteUser, getUser };
