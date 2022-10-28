const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flavorSchema = new Schema({
    name: {
        type: String, 
        unique: true,
        required: true,
    },
    available: {
        type: Boolean,
        default: true
    }
});

module.exports = flavorSchema;