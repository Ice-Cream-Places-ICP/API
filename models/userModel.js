const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
	},
	userType: {
		type: String,
		required: false,
		default: 'default',
	},
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
