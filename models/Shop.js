const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const addressSchema = require('./subdocuments/addressSchema');
const flavorSchema = require('./subdocuments/flavorSchema');
const employeeSchema = require('./subdocuments/employeeSchema');
const openingHoursSchema = require('./subdocuments/openingHours');
const reviewSchema = require('./subdocuments/reviewSchema');
const openingHoursOverflow = require('../utils/openingHoursOverflow');
const { roles, employeeStatus, shopFieldsToNotifyChange, notificationType } = require('../config/constants');

const shopSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: addressSchema,
		required: true,
	},
	openingHours: {
		type: [openingHoursSchema]
	},
	flavors: {
		type: [flavorSchema]
	},
	employees: {
		type: [employeeSchema]
	},
	reviews: {
		type: [reviewSchema]
	},
	rating: {
		type: Number
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	removedAt: {
		type: Date
	}
},
	{
		timestamps: true
	});

shopSchema.pre('save', async function () {
	validateOpeningHours(this);
	updateRating(this);
	notifyUsersAboutShopUpdate(this);
})

shopSchema.post('save', async function (doc) {
	if (doc.removedAt !== undefined) {
		updateUsersOnDelete(doc);
	}
	else {
		updateUsers(doc);
	}
});

const validateOpeningHours = async (doc) => {
	if (doc.openingHours && openingHoursOverflow(doc.openingHours)) {
		throw new Error('Too many opening hours specified')
	}
}

const updateRating = async (doc) => {
	let ratings = []
	doc.reviews.forEach(r => ratings.push(r.rate));
	const ratingsSum = ratings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
	doc.rating = !isNaN(ratingsSum / ratings.length) ? (ratingsSum / ratings.length) : 0;
}

const notifyUsersAboutShopUpdate = async (doc) => {
	const modifiedPaths = doc.modifiedPaths().values()
	for (let modifiedPath of modifiedPaths) {
		if (shopFieldsToNotifyChange.includes(modifiedPath)) {
			const users = await User.find({ favoriteShops: doc.id });
			const notification = {
				type: notificationType.SHOP_UPDATE,
				shop: {
					id: doc.id,
					name: doc.name,
					modifiedPath: modifiedPath
				}
			}
			for (let user of users) {
				user.notifications.push(notification);
				await user.save();
			}
		}
	}
}

const updateUsersOnDelete = async (doc) => {
	doc.employees.forEach(async employee => {
		if (employee.status === employeeStatus.ACTIVE) {
			let user = await doc.model('User').findOne({ email: employee.email }).exec();
			let userShops = user.shops;
			let userRoles = user.roles;

			let userShop = userShops.find(s => s.id === doc._id.toString());
			userShops.splice(user.shops.indexOf(userShop), 1);

			let updatedUserRoles = new Set([roles.DEFAULT]);
			if (userRoles.includes(roles.ADMIN)) {
				updatedUserRoles.add(roles.ADMIN);
			}

			userShops.forEach(shop => {
				updatedUserRoles.add(shop.jobPosition);
			});

			updatedUserRoles = Array.from(updatedUserRoles);

			user.roles = updatedUserRoles;
			user.shops = userShops;
			await user.save();
		}
	});
}

const updateUsers = async (doc) => {
	doc.employees.forEach(async employee => {
		if (employee.status === employeeStatus.ACTIVE) {
			let user = await doc.model('User').findOne({ email: employee.email, status: employeeStatus.ACTIVE }).exec();
			let userShops = user.shops;
			let userRoles = user.roles;

			let userShop = userShops.find(s => s.id === doc._id.toString());
			if (!userShops.includes(userShop)) {
				userShops.push({ id: doc._id, jobPosition: employee.jobPosition });
			}

			if (!userRoles.includes(employee.jobPosition)) {
				userRoles.push(employee.jobPosition);
			}

			user.roles = userRoles;
			user.shops = userShops;
			await user.save();
		}
	});
}

module.exports = mongoose.model('Shop', shopSchema);
