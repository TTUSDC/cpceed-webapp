const jwt = require('jsonwebtoken');
const AuthUser = require('./auth-models');

const login = (email, password, next) => {
  AuthUser.findOne({ email: email }, (err, user) => {
    if (err) { next(err); }
    else if (!user) { next('Auth failed'); }
    else {
      user.comparePassword(password, (err, isMatch) => {
        if (err) { next(err); }
        else {
          var token = jwt.sign(user, process.env.SECRET, {
            expiresIn: 60*60*24
          });

          next(null, token);
        }
      });
    }
  });
};

const logout = (req, res) => {

};

const create = (email, password, next) => {
  var user = new AuthUser({
    email: email,
    password: password
  });

  AuthUser.findOne({ email: email }, (err, existingUser) => {
    if (err) { next(err); }
    else if (existingUser) {
      next('Account with that email address already exists.');
    }
    else {
      user.save((err) => { next(err); });
    }
  });
};

const verify = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Auth failed.' });
      }
      else {
        req.decoded = decoded;
        next();
      }
    });
  }
  else {
    return res.status(403).send({
      message: 'No token provided.'
    });
  }
};

module.exports = { login, logout, create, verify };
