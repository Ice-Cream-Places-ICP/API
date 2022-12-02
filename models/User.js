const mongoose = require('mongoose');
const userShopSchema = require('./subdocuments/userShopSchema');
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
	}],
	favoriteFlavors: [{
		type: String
	}]
},
	{
		timestamps: true,
	});

userSchema.post('remove', async function (doc) {
	const shops = await doc.model('Shop').find({ "employees.email": doc.email });

	shops.forEach(shop => {
		let shopEmployees = shop.employees;
		let user = shopEmployees.find(e => e.email === doc.email);
		let userIndex = shopEmployees.indexOf(user);

		shopEmployees.splice(userIndex, 1);
		shop.employees = shopEmployees;
	})

	await shops.save();
})

module.exports = mongoose.model('User', userSchema);
