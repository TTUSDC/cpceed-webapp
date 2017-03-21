const express = require('express');

const manager = require('./auth-manager');
const router = express.Router();

/** hook up the routes **/
router.post('/', (req, res, next) => manager.login(req, res, next));
router.delete('/', (req, res, next) => manager.logout(req, res, next));
router.post('/create', (req, res, next) => manager.create(req, res, next));

module.exports = { router }
