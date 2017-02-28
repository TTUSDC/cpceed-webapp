var Schema = mongoose.Schema;

var studentSchema = new Schema({
	email: String,
	firstName: String,
	lastName: String,
	role: String,
	approvalStatus: Boolean,
	points: Number,
	studentId: Number
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
