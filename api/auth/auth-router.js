const express = require('express');
const authManager = require('api/auth/auth-manager');
const logger = require('common/logger.js');
const passport = require('api/passport-config.js');

const authRouter = express.Router();

// Get the current User's role.
authRouter.get('/', authManager.verify, (req, res) => {
  if (res.locals.err) {
    logger.error(res.locals.err);
    res.status(400).json(res.locals.err).end();
  }

  res.status(200).json({ role: req.user.role }).end();
});

// Log the User in on a specific device.
authRouter.post('/', passport.authenticate('local'), (req, res) => {
  // The token is in a cookie, so it doesn't have to be in the body
  res.status(201).end();
});

// Log the user out of a specific device.
authRouter.delete('/', authManager.verify, (req, res) => {
  if (res.locals.err) {
    res.status(400).json({ message: res.locals.err.message }).end();
    return;
  }

  authManager.logout()
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.status(400).json({ message: err.message }).end();
    });
});

// Change the user's password.
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

// Change the user's email.
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
