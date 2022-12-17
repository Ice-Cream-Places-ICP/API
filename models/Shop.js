const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = require('./subdocuments/addressSchema');
const flavorSchema = require('./subdocuments/flavorSchema');
const employeeSchema = require('./subdocuments/employeeSchema');
const openingHoursSchema = require('./subdocuments/openingHours');
const reviewSchema = require('./subdocuments/reviewSchema');
const openingHoursOverflow = require('../utils/openingHoursOverflow');
const { roles } = require('../config/constants');

const shopSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: addressSchema,
		required: true,
	},
	openingHours: [{
		type: openingHoursSchema
	}],
	flavors: [{
		type: flavorSchema
	}],
	employees: [{
		type: employeeSchema
	}],
	reviews: [{
		type: reviewSchema
	}],
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
	if (this.openingHours && openingHoursOverflow(this.openingHours)) {
		throw new Error('Too many opening hours specified')
	}

	let ratings = []
    this.reviews.forEach(r => ratings.push(r.rate));
	const ratingsSum = ratings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    this.rating = !isNaN(ratingsSum / ratings.length) ? (ratingsSum / ratings.length) : 0;
})

shopSchema.post('save', async function (doc) {
	if (doc.removedAt !== undefined) {
		doc.employees.forEach(async employee => {
			let user = await doc.model('User').findOne({ email: employee.email }).exec();
			let userShops = user.shops;
			let userRoles = user.roles;

			let userShop = userShops.find(s => s.id === doc._id.toString());
			userShops.splice(user.shops.indexOf(userShop), 1);

			let jobPositions = new Set([roles.DEFAULT]);
			userShops.forEach(shop => {
				jobPositions.add(shop.jobPosition);
			});

			jobPositions = Array.from(jobPositions);
			userRoles.forEach(role => {
				if (!jobPositions.includes(role)) {
					let roleIndex = userRoles.indexOf(role);
					userRoles.splice(roleIndex, 1);
				}
			})

			user.roles = userRoles;
			user.shops = userShops;
			await user.save();
		});
	}
	else {
		doc.employees.forEach(async employee => {
			let user = await doc.model('User').findOne({ email: employee.email }).exec();
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
		})
	}
});

module.exports = mongoose.model('Shop', shopSchema);
