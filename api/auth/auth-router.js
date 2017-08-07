const express = require('express');
const authManager = require('api/auth/auth-manager');
const logger = require('common/logger.js');

const authRouter = express.Router();

// Get the current User's role.
authRouter.get('/', authManager.verify, (req, res) => {
  if (res.locals.err) {
    logger.error(res.locals.err);
    res.status(400).json(res.locals.err).end();
  } else if (!res.locals.auth) {
    const noAuthError = new Error('User not verified.');
    logger.error(noAuthError);
    res.status(400).json(noAuthError).end();
  } else {
    res.status(200).json({ role: res.locals.auth.role }).end();
  }
});

// Log the User in (uses same token across all devices).
authRouter.post('/', (req, res) => {
  authManager.login(req.body.email, req.body.password)
    .then((id) => {
      res.status(201).json({ token: id }).end();
    })
    .catch((err) => {
      res.status(400).json(err).end();
    });
});

// Log the User out of all devices.
authRouter.delete('/', authManager.verify, (req, res) => {
  // TODO(NilsG-S): Make standard function to retrieve token?
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (res.locals.err) {
    res.json({ message: res.locals.err.message, status: 400 }).end();
    return;
  }

  authManager.logout(token)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.json({ message: err.message, status: 400 }).end();
    });
});

module.exports = { router: authRouter };
