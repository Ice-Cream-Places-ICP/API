const hasDuplicates = require('../../utils/hasDuplicates');

const hasDuplicatesTest = () => describe('hasDuplicates', () => {
    let array;
    describe('given array with duplicate values', () => {
        beforeEach(() => {
            array = ['val1', 'val1'];
        });

        test('should return true', () => {
            expect(hasDuplicates(array)).toBeTruthy();
        })
    })

    describe('given array with unique values', () => {
        beforeEach(() => {
            array = ['val1', 'val2'];
        });

        test('should return false', () => {
            expect(hasDuplicates(array)).toBeFalsy();
        })
    })
})

module.exports = hasDuplicatesTest;