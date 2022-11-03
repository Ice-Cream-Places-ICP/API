const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    }
}, 
{
    _id: false
});

module.exports = addressSchema;