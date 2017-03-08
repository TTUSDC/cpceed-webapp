var response = require('../Objects/response.js');
var userModels = require('./user-models.js');
var Student = userModels.Student;
var Admin = userModels.Admin;

var createUser = (reqData, createCallback) => {
  if (reqData.role == 'Student') {
    // Create new student.
    var student = new Student({
      approvalStatus: false,
      email: reqData.email,
      firstName: reqData.firstName,
      lastName: reqData.lastName,
      points: 0,
      role: 'Student',
      studentId: 0
    });
  // TODO(ryanfaulkenberry100): Write student to database.

  } else if (reqData.role == 'Admin') {
    // Create new admin.
    var admin = new Admin({
      email: reqData.email,
      firstName: reqData.firstName,
      lastName: reqData.lastName,
      role: 'Admin'
    });

  // TODO(ryanfaulkenberry100): Write admin to database.
  }

  return new response.ResponseObject(201, {"uid":"1", "url":"//www.google.com"});
}

var modifyUser = (userUid, reqData, modifyCallback) => {
  // TODO(ryanfaulkenberry100): Check if modifier is a user or an admin.
  if (/*modifying user is student*/ true) {
    modifyUserAsSelf(userUid, reqData, modifyCallback);
  } else if (/*modifying user is admin*/ false) {
    modifyUserAsAdmin(userUid, reqData, modifyCallback);
  } else {
    // TODO(ryanfaulkenberry100): handle errors.
  }

  return new response.ResponseObject(200, {"url":"//www.google.com"});
}

var deleteUser = (userUid) => {
  // TODO(ryanfaulkenberry100): Delete a user and remove console.log.
  console.log(userUid);

  return new response.ResponseObject(200, {"url":"//www.google.com"});
}

var getUser = (userUid) => {
  // Returns a user.

  // TODO(ryanfaulkenberry100): Find the user.

  var User = new Admin({
    // Placeholder, not necessarily an admin.
    email: "nobody@gmail.com",
    firstName: "John",
    lastName: "Doe",
    role: "Admin"
  });

  return new response.ResponseObject(200, User);
}

var modifyUserAsSelf = (userUid, reqData, modifyCallback) => {}
var modifyUserAsAdmin = (userUid, reqData, modifyCallback) => {}

module.exports = { createUser, modifyUser, deleteUser, getUser };
