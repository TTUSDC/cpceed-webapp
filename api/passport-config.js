const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const authErrors = require('api/errors/auth-errors');
const User = require('api/users/user-models').User;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
(email, password, done) => {
  let userStorage;

  User.findOne({ email }).exec()
    .catch((err) => {
      done(err);
    })
    .then((user) => {
      userStorage = user;

      // No user found for the given email address.
      if (!user) {
        const message = authErrors.invalidLoginInfoError.message;

        return done(null, false, { message });
      }

      return user.comparePassword(password);
    })
    .then(() => {
      done(null, userStorage);
    })
    .catch(() => {
      const message = authErrors.invalidLoginInfoError.message;

      done(null, false, { message });
    });
}));

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  User.findOne({ email }).exec()
    .catch((err) => {
      done(err, null);
    })
    .then((user) => {
      done(null, user);
    });
});

module.exports = passport;
