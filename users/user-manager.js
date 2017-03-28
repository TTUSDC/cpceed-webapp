var response = require('../Objects/response.js');
var userModels = require('./user-models.js');
var Student = userModels.Student;
var Admin = userModels.Admin;

var createUser = (reqData, createCallback) => {
  var user;
  if (reqData.role == 'Student') {
    // Create new student.
    user = new Student({
      approvalStatus: false,
      email: reqData.email,
      firstName: reqData.firstName,
      lastName: reqData.lastName,
      points: {
        career: 0,
        community: 0,
        firstother: 0,
        firstworkshops: 0,
        mentor: 0,
        other: 0,
        outreach: 0,
        professor: 0,
        staff: 0,
        misc: 0
      },
      role: 'Student',
      studentId: reqData.studentId
    });

  } else if (reqData.role == 'Admin') {
    // Create new admin.
    user = new Admin({
      email: reqData.email,
      firstName: reqData.firstName,
      lastName: reqData.lastName,
      role: 'Admin'
    });

  } else {
  // TODO(ryanfaulkenberry100): Handle error case where role is incorrect.
  }

  // TODO(ryanfaulkenberry100): Write user to database.

  return new response.ResponseObject(201, {"uid":"1", "url":"//www.google.com"});
  // TODO(ryanfaulkenberry100): Return actual data
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
  // TODO(ryanfaulkenberry100): Return actual data
}

var deleteUser = (userUid) => {
  // TODO(ryanfaulkenberry100): Delete a user and remove console.log.
  console.log(userUid);

  return new response.ResponseObject(200, {"url":"//www.google.com"});
  // TODO(ryanfaulkenberry100): Return actual data
}

var getUser = (userUid) => {
  // Returns a user.

  // TODO(ryanfaulkenberry100): Find the user, remove User var below
  var User = new Admin({
    // Placeholder
    email: "nobody@gmail.com",
    firstName: "John",
    lastName: "Doe",
    role: "Admin"
  });

  return new response.ResponseObject(200, User);
  // TODO(ryanfaulkenberry100): Return actual data
}

var modifyUserAsSelf = (userUid, reqData, modifyCallback) => {}
var modifyUserAsAdmin = (userUid, reqData, modifyCallback) => {}

module.exports = { createUser, modifyUser, deleteUser, getUser };
