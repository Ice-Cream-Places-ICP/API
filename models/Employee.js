const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
		ref: 'User'
    }, 
    shopId: {
        type: Schema.Types.ObjectId,
        required: true,
		ref: 'Shop'
    },
    role: {
        type: String,
        required: true,
        enum: ['employee', 'owner']
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);