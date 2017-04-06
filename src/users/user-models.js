const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const options = { discriminatorKey: 'type' };
const pointOption = {
  type: Number,
  required: true,
  default: 0
};

const userSchema = new Schema({
  firstName: String,
  lastName: String,
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
    enum: ['Student', 'Admin'],
    required: true
  },
  isApproved: {
    type: Boolean,
    required:true,
    default: false
  }
}, options);

userSchema.pre('save', function (next) {
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

userSchema.methods.comparePassword = function (password, next) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    next(err, isMatch);
  });
};

const studentSchema = new Schema({
      points: {
        career: pointOption,
        community: pointOption,
        firstother: pointOption,
        firstworkshops: pointOption,
        mentor: pointOption,
        other: pointOption,
        outreach: pointOption,
        professor: pointOption,
        staff: pointOption,
        misc: pointOption
      },
      studentId: {
        type: String,
        unique: true,
        require: true
      }
    },
    options);

const adminSchema = new Schema({}, options);

const User = mongoose.model('User', userSchema);

const Student = User.discriminator('Student', studentSchema);
const Admin = User.discriminator('Admin', adminSchema);

module.exports = { Student, Admin, User };
