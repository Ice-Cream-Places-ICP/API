const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = require('./subdocuments/addressSchema');
const flavorSchema = require('./subdocuments/flavorSchema');
const openingHoursSchema = require('./subdocuments/openingHours');
const openingHoursOverflow = require('../utils/openingHoursOverflow');

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
	owners: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	employees: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
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
})

module.exports = mongoose.model('Shop', shopSchema);
