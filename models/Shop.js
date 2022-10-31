const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = require('./subdocuments/addressSchema');
const flavorSchema = require('./subdocuments/flavorSchema');
const openingHoursSchema = require('./subdocuments/openingHours');

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
	removedAt: {
		type: Date
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
}, 
{
	timestamps: true
});

module.exports = mongoose.model('Shop', shopSchema);
