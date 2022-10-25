const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = require('./subdocuments/addressSchema');
const flavorSchema = require('./subdocuments/flavorSchema');

const shopSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: addressSchema,
		required: true,
	},
	ownerId: {
		type: mongoose.ObjectId,
		required: true,
	},
	flavors: [flavorSchema],
	active: {
		type: Boolean, 
		default: true
	},
	creatorId: {
		type: mongoose.ObjectId
	}
});

module.exports = mongoose.model('Shop', shopSchema);
