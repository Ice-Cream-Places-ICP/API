const mongoose = require('mongoose');
const userShopSchema = require('./subdocuments/userShopSchema');
const notificationSchema = require('./subdocuments/notificationSchema');
const { roles, userStatus, authMethod } = require('../config/constants');

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String
	},
	authType: {
		type: String,
		required: true,
		enum: [authMethod.EMAIL, authMethod.GOOGLE, authMethod.FACEBOOK]
	},
	googleId: {
		type: String
	},
	facebookId: {
	  	type: String
	},
	status: {
		type: String,
		enum: [userStatus.PENDING, userStatus.ACTIVE],
		default: userStatus.PENDING
	},
	confirmationCode: {
		type: String
	},
	passwordResetCode: {
		type: String
	},
	roles: {
		type: [String],
		default: [roles.DEFAULT],
		enum: [roles.DEFAULT, roles.ADMIN, roles.OWNER, roles.EMPLOYEE]
	},
	shops: {
		type: [userShopSchema]
	},
	notifications: {
		type: [notificationSchema]
	},
	favoriteShops: {
		type: [String]
	}
},
	{
		timestamps: true,
	});

userSchema.post('remove', async function (doc) {
	updateShopsOnDelete(doc);
})

const updateShopsOnDelete = async (doc) => {
	const shops = await doc.model('Shop').find({ "employees.email": doc.email });

	shops.forEach(shop => {
		let shopEmployees = shop.employees;
		let user = shopEmployees.find(e => e.email === doc.email);
		let userIndex = shopEmployees.indexOf(user);

		shopEmployees.splice(userIndex, 1);
		shop.employees = shopEmployees;
	})

	await shops.save();
} 

module.exports = mongoose.model('User', userSchema);
