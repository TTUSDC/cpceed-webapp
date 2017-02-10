var express = require('express');
var userService = require('./service.js');
var userRouter = express.Router();

// Create User
userRouter.post('/register', (req, res) => {
    var response = userService.createUser(req.body);

    res.status(response.status).json(response.object);
});

// Modify User (as self/admin)
userRouter.put('/:uid', (req, res) => {
    var response = userService.modifyUser(req.params.uid, req.body);

    res.status(response.status).json(response.body);
});

// Delete User
userRouter.delete('/:uid', (req, res) => {
    var response = userService.deleteUser(req.params.uid);

    res.status(response.status).json(response.object);
});

// Get User
userRouter.get('/:uid', (req, res) => {
    var response = userService.getUser(req.params.uid);

    res.status(response.status).json(response.object);
});

module.exports = { userRouter };