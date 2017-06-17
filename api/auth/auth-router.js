const express = require('express');
const authManager = require('./auth-manager');

const authErrors = require('../errors/auth-errors');
const authRouter = express.Router();

// Get the current User's role.
authRouter.get('/', authManager.verify, (req, res) => {
  if (res.locals.err) {
    res.status(400).json(res.locals.err).end();
  } else if (!res.locals.auth) {
    res.status(400).json(new Error('User not verified.')).end();
  } else {
    res.status(200).json({ role: res.locals.auth.role }).end();
  }
});

// Log the User in (uses same token across all devices).
authRouter.post('/', (req, res) => {
  authManager.login(req.body.email, req.body.password, (err, token) => {
    if (err) {
      res.status(400).json(err).end();
      return;
    }

    res.status(201).json({ token }).end();
  });
});

// Log the User out of all devices.
authRouter.delete('/', authManager.verify, (req, res) => {
  if (res.locals.err) {
    res.status(400).json(res.locals.err).end();
    return;
  }

  if (!res.locals.auth) {
    res.status(400).json(new Error('User not verified.')).end();
    return;
  }
  authManager.logout(res.locals.auth.email, (logoutErr) => {
    if (logoutErr) {
      res.status(400).json(logoutErr).end();
    } else {
      res.status(204).end();
    }
  });
});

module.exports = { router: authRouter };
