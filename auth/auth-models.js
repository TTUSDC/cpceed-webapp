const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/** set up user model **/
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
  admin: {
    type: Boolean,
    required: false
  }
}, { timestamps: true });

authSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) { return next(); }

  bcrypt.genSalt(process.env.SALT, (err, salt) => {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }

      user.password = hash;
      next();
    });
  });
});

authSchema.methods.comparePassword = function (candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    next(err, isMatch);
  });
}

const AuthUser = mongoose.model('AuthUser', authSchema);

module.exports = AuthUser;
