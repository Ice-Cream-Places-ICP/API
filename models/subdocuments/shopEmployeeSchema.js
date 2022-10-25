const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shopEmployeeSchema = new Schema({
    shopId: {
        type: mongoose.ObjectId, 
        required: true
    }, 
    role: {
        type: String,
        required: true
    }
});

module.exports = shopEmployeeSchema;