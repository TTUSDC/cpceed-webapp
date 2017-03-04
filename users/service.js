var response = require('../Objects/response.js');
var userModels = require('./userModels');
var Student = userModels.Student;
var Admin = userModels.Admin;

var createUser = (json) => {
  if (json.role == 'Student') {
    // Create new student.
    var student = new Student({
      approvalStatus: false,
      email: json.email,
      firstName: json.firstName,
      lastName: json.lastName,
      points: 0,
      role: 'Student',
      studentId: getUid();
    });
  // TODO(ryanfaulkenberry100): Write student to database.

  } else if (json.role == 'Admin') {
    // Create new admin.
    var admin = new Admin({
      email: json.email,
      firstName: json.firstName,
      lastName: json.lastName,
      role: 'Admin'
    });
  // TODO(ryanfaulkenberry100): Write admin to database.

  }

    return new response.ResponseObject(201, {"uid":"1", "url":"//www.google.com"});
}

var modifyUser = (id, json) => {
  // TODO(ryanfaulkenberry100): Check if modifier is a user or an admin.
  if () {
    // Modify user as self.
    modifyUserAsSelf(id, json);
  } else if () {
    // Modify user as admin.
    modifyUserAsAdmin(id, json);
  }

  return new response.ResponseObject(200, {"url":"//www.google.com"});
}

var deleteUser = (id) => {

  // TODO(ryanfaulkenberry100): Delete a user and remove console.log.
  console.log(id);

  return new response.ResponseObject(200, {"url":"//www.google.com"});
}

var getUser = (id) => {
  // Returns a user.

  // TODO(ryanfaulkenberry100): Find the user.
  console.log(id);

  return new response.ResponseObject(200, User);
}

// Define your public methods here.
module.exports = { createUser, modifyUser, deleteUser, getUser };
