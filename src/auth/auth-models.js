const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Set up AuthUser model.
const authSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['STUDENT', 'COORDINATOR'],
    required: true
  }
}, { timestamps: true });

authSchema.pre('save', function (next) {
  const user = this;

  // If the password is not modified, continue saving the user.
  if (!user.isModified('password')) { return next(); }

  bcrypt.genSalt(Number(process.env.SALT), (err, salt) => {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }

      user.password = hash;
      next();
    });
  });
});

authSchema.methods.comparePassword = function (password, next) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    next(err, isMatch);
  });
};

// Set up session model.
const sessionSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  token: {
    type: String,
    required: true
  }
});

sessionSchema.methods.compareToken = function (token, next) {
  next(token === this.token);
};

const AuthUser = mongoose.model('AuthUser', authSchema);
const Session = mongoose.model('Session', sessionSchema);

module.exports = { AuthUser, Session };
