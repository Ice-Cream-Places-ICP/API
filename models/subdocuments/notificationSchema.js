const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { notificationType, roles } = require('../../config/constants');

const notificationSchema = new Schema({
    shop: {
        type: {
            id: { 
                type: String
            }, 
            name: {
                type: String
            },
            jobPosition: {
                type: String,
                enum: [roles.EMPLOYEE, roles.OWNER]
            },
            _id: false
        },
    },
    type: {
        type: String,
        enum: [notificationType.SHOP_INVITATION, notificationType.SHOP_UPDATE]
    }
});

module.exports = notificationSchema;