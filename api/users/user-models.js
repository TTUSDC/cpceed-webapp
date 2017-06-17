const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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


/**
* Callback for {@link userSchema.methods.comparePassword}
* @typedef {Object} ComparePasswordNext
* @param {Object} err - error
* @param {boolean} isMatch - Whether or not the passwords matched
*/

/**
* Helper method to check users password
* @param {string} password - The password to be compared to the user's password
* @param {ComparePasswordNext} next
*/
userSchema.methods.comparePassword = function comparePassword(password, next) {
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
