const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validateLocation = require('../../utils/validateLocation');

const addressSchema = new Schema({
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postCode: {
        type: String,
        required: true
    }, 
    streetName: {
        type: String,
        required: true
    }, 
    streetNumber: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: "Point",
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, 
{
    _id: false
});

addressSchema.pre('save', async function () {
    if (!validateLocation(this.location.coordinates[0], this.location.coordinates[1])) {
        throw new Error('Location coordinates must be value between (-180, 180) for longtitude (first value) and value between (-90, 90) for latitude (second value)');
    }
});

module.exports = addressSchema;