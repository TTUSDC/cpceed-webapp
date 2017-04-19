const express = require('express');
const authManager = require('./auth-manager');

const authRouter = express.Router();

// Get the current User's role.
authRouter.get('/', authManager.verify, (err, req, res, next) => {
  if (err) {
    res.status(400).send(err).end();
  } else if (!res.locals.auth) {
    res.status(400).send('User not verified.').end();
  } else {
    res.status(200).json({ role: res.locals.auth.role }).end();
  }
});

// Log the User in (uses same token across all devices).
authRouter.post('/', (req, res) => {
  authManager.login(req.body.email, req.body.password, (err, token) => {
    if (err) {
      res.status(400).send(err).end();
      return;
    }

    res.status(201).json({ token }).end();
  });
});

// Log the User out of all devices.
authRouter.delete('/', authManager.verify, (err, req, res, next) => {
  if (err) {
    res.status(400).send(err).end();
    return;
  }

  if (!res.locals.auth) {
    res.status(400).send('User not verified.').end();
    return;
  }

  authManager.logout(req.local.email, (logoutErr) => {
    if (logoutErr) {
      res.status(400).send(err).end();
    } else {
      res.status(204).end();
    }
  });
});

module.exports = { router: authRouter };
