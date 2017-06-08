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

// Modify User
userRouter.put('/',
    authManager.verify,
    authManager.validateUidPermissions,
    (req, res) => {
      userManager.modifyUser(res.locals.uid, req.body, res.locals,
        (err, user) => {
          if (err) {
            res.status(400).json(err).end();
            return;
          }
          res.status(200).json(user).end();
        });
    });

// Delete User.
userRouter.delete('/',
    authManager.verify,
    authManager.validateUidPermissions,
    (req, res) => {
      userManager.deleteUser(res.locals.uid, res.locals, (err, result) => {
        if (err) {
          res.status(400).json(err).end();
          return;
        }
        res.status(200).json(result).end();
      });
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
