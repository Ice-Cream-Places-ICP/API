const mongoose = require('mongoose');
const addressSchema = require('./addressSchema');

const shopSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: addressSchema,
		required: true,
	},
	flavors: [{ type: String, unique: false }],
	openHours: [
		[
			{
				type: String,
				require: true,
			},
		],
	],
	ownerId: {
		type: String,
		require: true,
	},
});

const shopModel = mongoose.model('Shop', shopSchema);
module.exports = shopModel;
