const express = require('express');
const userManager = require('./user-manager.js');

const userRouter = express.Router();

// Create User.
userRouter.post('/', (req, res) => {
  userManager.createUser(req.body, (err, id) => {
    if (err) {
      res.status(400).json(err).end();
    } else {
      // A User was created.
      res.status(201).json({ uid: id }).end();
    }
  });
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
