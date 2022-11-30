const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { roles } = require('../../config/constants');

const employeeSchema = new Schema({
    email: {
        type: String,
        ref: 'User'
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

module.exports = employeeSchema;