var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var options = {discriminatorKey: 'type'};

var userSchema = new Schema({
      firstName: String,
      lastName: String,
      email: String,
      role: String,
    },
    options);

var studentSchema = new Schema({
      approvalStatus: Boolean,
      points: {
        career: Number,
        community: Number,
        firstother: Number,
        firstworkshops: Number,
        mentor: Number,
        other: Number,
        outreach: Number,
        professor: Number,
        staff: Number,
        misc: Number
      },
      studentId: String,
    },
    options);

var adminSchema = new Schema({}, options);

var User = mongoose.model('User', userSchema);

var Student = User.discriminator('Student', studentSchema);
var Admin = User.discriminator('Admin', adminSchema);

module.exports = { Student, Admin };
