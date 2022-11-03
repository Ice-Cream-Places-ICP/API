const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flavorSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    available: {
        type: Boolean,
        default: true
    }
},
{
    _id: false
});

module.exports = flavorSchema;