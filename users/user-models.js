var Schema = mongoose.Schema;

var studentSchema = new Schema({
  approvalStatus: Boolean,
  email: String,
  firstName: String,
  lastName: String,
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
  role: String,
  studentId: String
});

var adminSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  role: String
});

var Student = mongoose.model('Student', studentSchema, 'users');
var Admin = mongoose.model('Admin', adminSchema, 'users');

module.exports = { Student, Admin };
