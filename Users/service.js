var response = require('../Objects/response.js');

var createUser = function (id, json) {
	// Create Student
	if (id == 0) {
		var User = new Student({
			approvalStatus: false,
			email: "email@email.com",
			firstName: "Mortimer",
			lastName: "Applesauce",
			points: 0,
			role: "Student",
			studentId: "69"
		})
	}

	// Create Admin
	else if (id == 1) {
		var User = new Admin({
			email: "email@email.com",
			firstName: "Mortimer",
			lastName: "Applesauce",
			role: "Admin"
		})
	}

	// TODO: save User

    // TODO: remove console.log
    console.log(json);

    return new response.ResponseObject(201, {"uid":"1", "url":"//www.google.com"});
}

var modifyUser = function (id, json) {
    if (id == 0) {
		 // Modify as student
	}
	else if (id == 1) {
		// Modify as admin
	}

    // TODO: Send to modifyUserAsSelf or modifyUserAsAdmin
    // TODO: Remove
    console.log(id, json);

    return new response.ResponseObject(200, {"url":"//www.google.com"});
}

var deleteUser = function (id) {
    // Deletes a user

    // TODO: Delete a user and remove console.log
    console.log(id);

    return new response.ResponseObject(200, {"url":"//www.google.com"});
}

var getUser = function (id) {
    // Returns a user

    // TODO: Find the user
    console.log(id);

    return new response.ResponseObject(200, {
        "user": {
            "approvalStatus":"true",
            "email":"test@test.com",
            "firstName":"first",
            "lastName":"last",
            "points":"0",
            "studentId":"1"
        },
        "url":"//www.google.com"
    });
}

// Define your public methods here
module.exports = { createUser, modifyUser, deleteUser, getUser };
