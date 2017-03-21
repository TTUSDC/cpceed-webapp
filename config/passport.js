const _ = require('lodash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const AuthUser = require('../auth/auth-models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  AuthUser.findByID(id, (err, user) => {
    done(err, user);
  });
});

/** sign in with email/password **/
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  AuthUser.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found` });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Invalid email or password' });
    });
  });
}));

/** login required middleware **/
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth');
};

/** authorization required middleware **/
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  }
  else {
    res.redirect(`auth/${provider}`);
  }
};
