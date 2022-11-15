const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = require('./subdocuments/addressSchema');
const flavorSchema = require('./subdocuments/flavorSchema');
const openingHoursSchema = require('./subdocuments/openingHours');
const Employee = require('./Employee');
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

shopSchema.pre('save', async function () {
	const defaultUserMutableKeys = ['flavors', 'updatedAt'];

	if (this.openingHours && openingHoursOverflow(this.openingHours)) {
		throw new Error('Too many opening hours specified')
	}

	if (!this.$isNew) {
		const employee = await Employee
			.findOne({ user: this.creator, shop: this._id })
			.populate('user')
			.exec();

		await this.populate('creator');

		if (!employee && this.creator.type !== 'admin') {
			throw new Error('User cannot modify this shop');
		}

		if (employee.user.type === 'default' && employee.role !== 'owner') {
			this.modifiedPaths().forEach(key => {
				if (!defaultUserMutableKeys.includes(key.toString())) {
					throw new Error(`User cannot modify '${key}' property`);
				}
			})
		}
	}
})

module.exports = mongoose.model('Shop', shopSchema);
