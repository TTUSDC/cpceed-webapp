const express = require('express');
const userRouter = express.Router();

const userManager = require('./user-manager.js');
const verify = require('../auth/auth-manager.js').verify;

// Create User.
userRouter.post('/', (req, res) => {
  userManager.createUser(req.body, (err, id) => {
    if (err || !id) {
      res.status(500).json(err).end();
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

// Mark the User as approved.
userRouter.post('/approve/', verify, (req, res) => {
  if (!res.locals.auth || res.locals.auth.role !== 'Admin' || !res.locals.auth.isApproved) {
    res.status(400).send('User not authorized.').end();
    return;
  }

  userManager.approveUser(req.body.email, (err) => {
    if (err) {
      res.status(500).send(err).end();
      return;
    }

    res.status(204).end();
  });
});

module.exports = { userRouter };
