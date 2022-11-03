const { weekDayNames } = require('../config/constants');

const mapOpeningHoursToRes = (openingHoursDto) => {
    const weekDay = weekDayNames[openingHoursDto.weekDay];
    const startTime =  parseTime(openingHoursDto.startHour, openingHoursDto.startMinute);
    const endTime =  parseTime(openingHoursDto.endHour, openingHoursDto.endMinute);

    return {
        weekDay: weekDay,
        startTime: startTime,
        endTime: endTime
    }
}

const mapOpeningHoursToDb = (openingHours) => {
    const weekDay = Object.values(weekDayNames).indexOf(openingHours.weekDay);
    const startHour = +openingHours.startTime.split(':')[0];
    const startMinute = +openingHours.startTime.split(':')[1];
    const endHour = +openingHours.endTime.split(':')[0];
    const endMinute = +openingHours.endTime.split(':')[1];

    return {
        weekDay: weekDay,
        startHour: startHour,
        startMinute: startMinute,
        endHour: endHour,
        endMinute: endMinute
    }
}

const parseTime = (hour, minute) => {
    const stringHour = hour >= 10 ? hour : `0${hour}`;
    const stringMinute = minute >= 10 ? minute : `0${minute}`;
    return `${stringHour}:${stringMinute}`;
}

module.exports = { mapOpeningHoursToRes, mapOpeningHoursToDb };