const express = require('express');
const authManager = require('./auth-manager');

const authRouter = express.Router();

// Get the current User's role.
authRouter.get('/', authManager.verify, (req, res) => {
  if (!res.locals.auth) {
    res.status(400).send('User not verified.').end();
    return;
  }

  res.status(200).json({ role: res.locals.auth.role }).end();
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
authRouter.delete('/', authManager.verify, (req, res) => {
  if (!res.locals.auth) {
    res.status(400).send('User not verified.').end();
    return;
  }

  authManager.logout(req.local.email, (err) => {
    if (err) {
      res.status(400).send(err).end();
      return;
    }

    res.status(204).end();
  });
});

module.exports = {
  router: authRouter,
};
