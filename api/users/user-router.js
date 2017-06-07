const express = require('express');
const userManager = require('./user-manager');
const authManager = require('../auth/auth-manager');

const userRouter = express.Router();

// Create User.
userRouter.post('/', (req, res) => {
  userManager.createUser(req.body, (err, uid) => {
    if (err) {
      res.status(400).json(err).end();
    } else {
      // A User was created.
      res.status(201).json({ uid }).end();
    }
  });
});

userRouter.put('/:uid', authManager.verify, (req, res) => {
  const response = userManager.modifyUser(req.params.uid, req.body, (err) => {
    if (err) {
      res.status(400).send(err).end();
      return;
    }
    res.status(200).json(response.object);
  });
});

// Delete User.
userRouter.delete('/:uid', (req, res) => {
  const response = userManager.deleteUser(req.params.uid);

  res.status(200).json(response.object);
});

// Get User.
userRouter.get('/',
    authManager.verify,
    authManager.validateUidPermissions,
    (req, res) => {
      const uid = res.locals.uid;
      userManager.getUserById(uid, {}, (err, user) => {
        if (err) {
          res.status(400).send(err).end();
          return;
        }

        if (!user) {
          res.status(404).end();
          return;
        }

        res.status(200).json(user).end();
      });
    });

module.exports = { userRouter };
