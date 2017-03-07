var response = require('../Objects/response.js');
var userModels = require('./user-models.js');
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
      studentId: 0
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
  if (/*modifying user is student*/ true) {
    modifyUserAsSelf(id, json);
  } else if (/*modifying user is admin*/ false) {
    modifyUserAsAdmin(id, json);
  } else {
    // TODO(ryanfaulkenberry100): handle errors.
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
  var User = new Admin({
    // Placeholder, not necessarily a student.
    email: "nobody@gmail.com",
    firstName: "John",
    lastName: "Doe",
    role: "Admin"
  });

  return new response.ResponseObject(200, User);
}

var modifyUserAsSelf = () => {}
var modifyUserAsAdmin = () => {}

// Define your public methods here.
module.exports = { createUser, modifyUser, deleteUser, getUser };
