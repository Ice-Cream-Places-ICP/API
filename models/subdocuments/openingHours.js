const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const openingHoursSchema = new Schema({
    weekDay: {
        type: Number,
        required: true
    },
    startHour: {
        type: Number,
        required: true
    },
    startMinute: {
        type: Number,
        default: 0
    },
    endHour: {
        type: Number,
        required: true
    },
    endMinute: {
        type: Number,
        default: 0
    }
}, 
{
    _id: false
});

openingHoursSchema.pre('save', async function () {
    if (this.weekDay < 0 || this.weekDay > 6 || !Number.isInteger(this.weekDay)) {
        throw new Error('Week day must be integer value between 0 and 6');
    }

    if (this.startHour < 0 || this.startHour > 24 || !Number.isInteger(this.startHour) ||
        this.endHour < 0 || this.endHour > 24 || !Number.isInteger(this.endHour)) {
        throw new Error('Hour must be integer value between 0 and 23');
    }

    if (this.startMinute < 0 || this.startMinute > 60 || !Number.isInteger(this.startMinute) ||
        this.endMinute < 0 || this.endMinute > 60 || !Number.isInteger(this.endMinute)) {
        throw new Error('Minute must be integer value between 0 and 59');
    }
});

module.exports = openingHoursSchema;