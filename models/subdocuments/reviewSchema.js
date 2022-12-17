const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rate: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    content: {
        type: String
    }
},
    {
        timestamps: true
    });

reviewSchema.pre('save', async function () {
    if (!this.isNew) {
        this.updatedAt = new Date();
    }
})

module.exports = reviewSchema;