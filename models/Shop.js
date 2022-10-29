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
	flavors: [{
		type: flavorSchema
	}],
	active: {
		type: Boolean, 
		default: true
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
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
