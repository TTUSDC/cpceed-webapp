const express = require('express');
const authRouter = express.Router();

const authManager = require('./auth-manager');

// Get the current User's role.
authRouter.get('/', authManager.verify, (req, res) => {
  if (!req.decoded) {
    res.status(400).send('Auth failed.').end();
  } else {
    res.status(201).json({ role: req.decoded.role }).end();
  }
});

// Log the User in (uses same token across all devices).
authRouter.post('/', (req, res) => {
  authManager.login(req.body.email, req.body.password, (err, token) => {
    if (err) {
      res.status(400).send(err).end();
    } else {
      res.status(201).json({ token: token }).end();
    }
  });
});

// Log the User out of all devices.
authRouter.delete('/', authManager.verify, (req, res) => {
  if (!req.decoded) {
    res.status(400).send('Auth failed.').end();
  } else {
    authManager.logout(req.decoded.email, (err) => {
      if (err) {
        res.status(500).send(err).end();
      } else {
        res.status(201).end();
      }
    });
  }
});

// Mark the User as approved.
authRouter.post('/approve/', authManager.verify, (req, res) => {
  if (!req.decoded || req.decoded.role !== 'Admin' || !req.decoded.isApproved) {
    res.status(400).send('User not authorized.').end();
  } else {
    authManager.approve(req.body.email, (err) => {
      if (err) {
        res.status(500).send(err).end();
      } else {
        res.status(201).end();
      }
    });
  }
});

module.exports = { router: authRouter }
