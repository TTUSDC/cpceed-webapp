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

// Log the User in on a specific device.
authRouter.post('/', (req, res) => {
  authManager.login(req.body.email, req.body.password)
    .then((id) => {
      res.status(201).json({ token: id }).end();
    })
    .catch((err) => {
      res.status(400).json(err).end();
    });
});

// Log the User out of a specific device.
authRouter.delete('/', authManager.verify, (req, res) => {
  if (res.locals.err) {
    res.status(400).json({ message: res.locals.err.message }).end();
    return;
  }

  // TODO(NilsG-S): Make standard function to retrieve token?
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  authManager.logout(token)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.status(400).json({ message: err.message }).end();
    });
});

authRouter.put('/password',
  authManager.verify,
  authManager.validateUidPermissions,
  (req, res) => {
    // TODO(NilsG-S): Move this error handling to the middleware? Just don't call next()...
    if (res.locals.err) {
      res.status(400).json({ message: res.locals.err.message }).end();
      return;
    }

    const body = req.body;

    authManager.changePassword(body.email, body.password, body.newPassword)
      .then(() => {
        res.status(200).end();
      })
      .catch((err) => {
        res.status(400).json({ message: err.message }).end();
      });
  });

authRouter.put('/email',
  authManager.verify,
  authManager.validateUidPermissions,
  (req, res) => {
    if (res.locals.err) {
      res.status(400).json({ message: res.locals.err.message }).end();
      return;
    }

    const body = req.body;

    authManager.changeEmail(body.email, body.password, body.newEmail)
      .then(() => {
        res.status(200).end();
      })
      .catch((err) => {
        res.status(400).json({ message: err.message }).end();
      });
  });

module.exports = { router: authRouter };
