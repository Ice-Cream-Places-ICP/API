const openingHoursOverlow = require('../../utils/openingHoursOverflow');

const openingHoursOverflowTest = () => describe('openingHoursOverlow', () => {
    let openingHours;
    describe('given object with 7 duplicate weekDays values', () => {
        beforeEach(() => {
            openingHours = [
                { weekDay: 0 },
                { weekDay: 0 },
                { weekDay: 0 },
                { weekDay: 0 },
                { weekDay: 0 },
                { weekDay: 0 },
                { weekDay: 0 },
            ]
        });

        test('should return true', () => {
            expect(openingHoursOverlow(openingHours)).toBeTruthy();
        })
    })

    describe('given object with more than 7 weekDays values', () => {
        beforeEach(() => {
            openingHours = [
                { weekDay: 0 },
                { weekDay: 1 },
                { weekDay: 2 },
                { weekDay: 3 },
                { weekDay: 4 },
                { weekDay: 5 },
                { weekDay: 6 },
                { weekDay: 7 },
            ]
        });

        test('should return true', () => {
            expect(openingHoursOverlow(openingHours)).toBeTruthy();
        })
    })

    describe('given object with 7 unique weekDays values', () => {
        beforeEach(() => {
            openingHours = [
                { weekDay: 0 },
                { weekDay: 1 },
                { weekDay: 2 },
                { weekDay: 3 },
                { weekDay: 4 },
                { weekDay: 5 },
                { weekDay: 6 },
            ]
        });

        test('should return false', () => {
            expect(openingHoursOverlow(openingHours)).toBeFalsy();
        })
    })
})

module.exports = openingHoursOverflowTest;