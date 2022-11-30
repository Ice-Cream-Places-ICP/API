const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userShopSchema = require('./subdocuments/userShopSchema');
const bcrypt = require('bcrypt');
const { roles } = require('../config/constants');

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
	roles: [{
		type: String,
		default: ['default'],
		enum: [roles.DEFAULT, roles.ADMIN, roles.OWNER, roles.EMPLOYEE]
	}],
	shops: [{
		type: userShopSchema
	}]
},
	{
		timestamps: true,
	});

userSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre('remove', async function (doc) {
	const shops = await doc.model('Shop').find({ "employees.email": doc.email });
	let shopEmployees = shop.employees;

	shops.forEach(shop => {
		let employee = shopEmployees.find(e => e.email === doc.email);
		let userIndex = shop.employees.indexOf(employee);
		shopEmployees.splice(userIndex, 1);
	})

	shop.employees = shopEmployees;
	await shops.save();
})

module.exports = mongoose.model('User', userSchema);
