const express = require('express');

const manager = require('./auth-manager');
const router = express.Router();

/** hook up the routes **/
router.post('/', (req, res) => {
  manager.login(req.body.email, req.body.password, (err, token) => {
    if (err) {
      res.status(400).send(err).end();
    }
    else {
      res.status(201).json({ token: token }).end();
    }
  });
});

router.delete('/', manager.verify, (req, res) => {
  manager.logout(req.decoded.email, (err) => {
    if (err) {
      res.status(400).send(err).end();
    }
    else {
      res.status(201).end();
    }
  });
});

router.post('/create/', (req, res) => {
  manager.create(req.body.email, req.body.password, req.body.role, (err) => {
    if (err) {
      res.status(400).send(err).end();
    }
    else {
      res.status(201).end();
    }
  });
});

module.exports = { router, verify: manager.verify }
