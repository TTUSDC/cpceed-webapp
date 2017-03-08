var express = require('express');
var mongoose = require('mongoose');
var userManager = require('./user-manager.js');
var userRouter = express.Router();

userRouter.post('/', (req, res) => {
  var response = userManager.createUser(req.body);

  res.status(201).json(response.object);
});

userRouter.put('/:uid', (req, res) => {
  var response = userManager.modifyUser(req.params.uid, req.body, (err) => {
    if (err) {
      res.status(400).send(err).end();
      return;
    }
  res.status(200).json(response.object);
  });
});

// Delete User.
userRouter.delete('/:uid', (req, res) => {
  var response = userManager.deleteUser(req.params.uid);

  res.status(200).json(response.object);
});

// Get User.
userRouter.get('/:uid', (req, res) => {
  var response = userManager.getUser(req.params.uid);

  res.status(200).json(response.object);
});

module.exports = { userRouter };
