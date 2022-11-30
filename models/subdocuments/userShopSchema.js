const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { roles } = require('../../config/constants');

const userShopSchema = new Schema({
    id: {
        type: String,
        ref: 'Shop'
    },
    jobPosition: {
        type: String,
        enum: [roles.OWNER, roles.EMPLOYEE],
        default: roles.EMPLOYEE
    }
},
    {
        _id: false
    });

module.exports = userShopSchema;