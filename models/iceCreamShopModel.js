const mongoose = require('mongoose');

const iceCreamShopSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	ownerId: {
		type: String,
		required: true,
	},
	flavors: [],
});

const iceCreamShopModel = mongoose.model('iceCreamShopModel', iceCreamShopSchema);
module.exports = iceCreamShopModel;
