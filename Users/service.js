var response = require('../Objects/response.js');

var createUser = function (json) {
    // Creates a user

    // TODO: Create user and remove console.log
    console.log(json);

    return new response.ResponseObject(201, {"uid":"1", "url":"//www.google.com"});
}

var modifyUser = function (id, json) {
    // Modifies user

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