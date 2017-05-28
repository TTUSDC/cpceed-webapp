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
userRouter.get('/', authManager.verify, (req, res) => {
  // let uid = res.locals.auth.id;
  // if(!uid) {
  //   res.status(400).send(new Error('Not logged in.'));
  //   return;
  // }

  // if (req.query.uid) {
  //   if (res.locals.auth.role === 'admin') {
  //     uid = req.query.uid;
  //   } else if (req.query.uid != uid){
  //     res.status(401).send(new Error('Not authorized.'));
  //     return;
  //   }
  // }
  const uid = req.query.uid;
  userManager.getUserById(uid, {}, (err, user) => {
    if(err) {
      res.status(400).send(err).end();
      return;
    }

    if (!user) {
      res.status(404).end();
      return;
    }

    res.status(200).json(user).end();
  })
});

module.exports = { userRouter };
