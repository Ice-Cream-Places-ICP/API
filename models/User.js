const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
	},
	type: {
		type: String,
		default: 'default',
		enum: ['default', 'admin']
	}
},
{
	timestamps: true
});

userSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre('save', async function () {
	if (this.type == '') {
		this.type = 'default';
	}
	if (this.type == null) {
		this.type = 'default';
	}
});

module.exports = mongoose.model('User', userSchema);
