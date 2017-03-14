var express = require('express');
var mongoose = require('mongoose');
var authManager = require('./auth-manager');
var authRouter = express.Router();

authRouter.post('/session', (req, res) => {});

authRouter.delete('/session/:uid', (req, res) => {});

module.exports = {authRouter};
