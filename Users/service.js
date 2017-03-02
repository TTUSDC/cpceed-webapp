var response = require('../Objects/response.js');

var createUser = (json) => {
	// Create Student
	if (json.role == 'Student') {
		var Student = new StudentModel({
			approvalStatus: json.approvalStatus,
			email: json.email,
			firstName: json.firstName,
			lastName: json.lastName,
			points: json.points,
			role: json.role,
			studentId: json.studentId
		});
	// TODO: Write new Student to database
	}

	// Create Admin
	else if (json.role == 'Admin') {
		var Admin = new AdminModel({
			email: json.email,
			firstName: json.firstName,
			lastName: json.lastName,
			role: json.role
		});
	// TODO: Write new Admin to database
	}

    return new response.ResponseObject(201, {"uid":"1", "url":"//www.google.com"});
}

var modifyUser = (id, json) => {
	// Modify user as self
    if (json.requesterUid == 0) {
		modifyUserAsSelf(id, json);
	}
	// Modify user as admin
	else if (json.jsonuesterUid == 1) {
		modifyUserAsAdmin(id, json);
	}

    return new response.ResponseObject(200, {"url":"//www.google.com"});
}

var deleteUser = (id) => {

    // TODO: Delete a user and remove console.log
    console.log(id);

    return new response.ResponseObject(200, {"url":"//www.google.com"});
}

var getUser = (id) => {
    // Returns a user

    // TODO: Find the user
    console.log(id);

    return new response.ResponseObject(200, User);
}

// Define your public methods here
module.exports = { createUser, modifyUser, deleteUser, getUser };
