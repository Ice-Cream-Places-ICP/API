const { weekDayNames } = require('../config/constants');

const formatOpeningHours = (openingHours) => {
    const weekDay = weekDayNames[openingHours.weekDay];
    const startTime =  parseTime(openingHours.startHour, openingHours.startMinute);
    const endTime =  parseTime(openingHours.endHour, openingHours.endMinute);

    return {
        weekDay: weekDay,
        startTime: startTime,
        endTime: endTime
    }
}

const parseTime = (hour, minute) => {
    const stringHour = hour >= 10 ? hour : `0${hour}`;
    const stringMinute = minute >= 10 ? minute : `0${minute}`;
    return `${stringHour}:${stringMinute}`;
} 

module.exports = { formatOpeningHours };