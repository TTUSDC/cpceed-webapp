const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const options = { discriminatorKey: 'type' };
const pointOption = {
  type: Number,
  required: true,
  default: 0,
};

/**
* User Object
* @typedef {Object} UserSchema
* @param {string} name - Screen name for user
* @param {string} firstName - DEPRECATED
* @param {string} lastName - DEPRECATED
* @param {string} email
* @param {string} password
* @param {string} role - ENUM: student, admin
* @param {boolean} isApproved
*/
const userSchema = new Schema({
  name: String,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    required: true,
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false,
  },
}, options);

/**
*  Updates and saves the user's password
*/
userSchema.pre('save', function pre(next) {
  const user = this;

  // If the password is not modified, continue saving the user.
  if (!user.isModified('password')) {
    next();
    return;
  }

  bcrypt.genSalt(Number(process.env.SALT), (saltErr, salt) => {
    if (saltErr) {
      next(saltErr);
      return;
    }

    bcrypt.hash(user.password, salt, (hashErr, hash) => {
      user.password = hash;
      next(hashErr);
    });
  });
});

userSchema.pre('findOneAndUpdate', function preUpdate(next) {
  const password = this.getUpdate().$set.password;

  // If the password is not modified, continue saving the user.
  if (!password) {
    next();
    return;
  }

  bcrypt.genSalt(Number(process.env.SALT), (saltErr, salt) => {
    if (saltErr) {
      next(saltErr);
      return;
    }

    bcrypt.hash(password, salt, (hashErr, hash) => {
      /* eslint-disable no-underscore-dangle */
      this._update.$set.password = hash;
      /* eslint-enable no-underscore-dangle */
      next(hashErr);
    });
  });
});

/**
* Helper method to check users password
* @param {string} password - The password to be compared to the user's password
* @returns {Promise<boolean, Error>} - Resolves with a boolean indicating whether
* or not the password is a match
*/
userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
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
    misc: pointOption,
  },
  studentId: {
    type: String,
  },
}, options);

const adminSchema = new Schema({}, options);

const User = mongoose.model('User', userSchema);

const Student = User.discriminator('student', studentSchema);
const Admin = User.discriminator('admin', adminSchema);

module.exports = { Student, Admin, User };
