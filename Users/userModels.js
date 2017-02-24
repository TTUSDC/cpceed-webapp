var userSchema = mongoose.Schema({
	approvalStatus: Boolean,
	email: String,
	firstName: String,
	lastName: String,
	points: Number,
	role: String,
	studentId: Number
});

var User = mongoose.model('User', userSchema);

module.exports = { User };
