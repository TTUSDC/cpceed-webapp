var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:80085');
var userModels = require('./userModels');
var StudentModel = userModels.Student;
var AdminModel = userModels.Admin;
var userService = require('./service.js');
var userRouter = express.Router();

// Create User
userRouter.post('/:uid', (req, res) => {
    var response = userService.createUser(req.body);

    res.status(response.status).json(response.object);
});

// Modify User
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
