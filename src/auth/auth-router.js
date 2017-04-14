const express = require('express');
const authRouter = express.Router();

const authManager = require('./auth-manager');

// Get the current User's role.
authRouter.get('/', authManager.verify, (req, res) => {
  if (!req.local) {
    res.status(400).send('Auth failed.').end();
    return;
  }

  res.status(201).json({ role: req.local.role }).end();
});

// Log the User in (uses same token across all devices).
authRouter.post('/', (req, res) => {
  authManager.login(req.body.email, req.body.password, (err, token) => {
    if (err) {
      res.status(400).send(err).end();
      return;
    }

    res.status(201).json({ token: token }).end();
  });
});

// Log the User out of all devices.
authRouter.delete('/', authManager.verify, (req, res) => {
  if (!req.local) {
    res.status(400).send('Auth failed.').end();
    return;
  }

  authManager.logout(req.local.email, (err) => {
    if (err) {
      res.status(500).send(err).end();
      return;
    }

    res.status(201).end();
  });
});

// Mark the User as approved.
authRouter.post('/approve/', authManager.verify, (req, res) => {
  if (!req.local || req.local.role !== 'Admin' || !req.local.isApproved) {
    res.status(400).send('User not authorized.').end();
    return;
  }

  authManager.approve(req.body.email, (err) => {
    if (err) {
      res.status(500).send(err).end();
      return;
    }

    res.status(201).end();
  });
});

module.exports = { router: authRouter }
