const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { roles, employeeStatus } = require('../../config/constants');

const employeeSchema = new Schema({
    email: {
        type: String,
        ref: 'User'
    },
    jobPosition: {
        type: String,
        enum: [roles.OWNER, roles.EMPLOYEE],
        default: roles.EMPLOYEE
    },
    status: {
        type: String,
        enum: [employeeStatus.ACTIVE, employeeStatus.PENDING, employeeStatus.REJECT],
        default: employeeStatus.PENDING
    }
},
    {
        _id: false
    });

module.exports = employeeSchema;