const isAdmin = require('../../utils/isAdmin');
const { roles } = require('../../config/constants');

const isAdminTest = () => describe('isAdmin', () => {
    describe('given user with empty roles list', () => {
        let user;
        beforeEach(() => {
            user = {
                roles: []
            }
        })

        test('should return false', () => {
            expect(isAdmin(user)).toBeFalsy();
        })
    })

    describe('given user who is not admin', () => {
        let user;
        beforeEach(() => {
            user = {
                roles: [roles.DEFAULT]
            }
        })

        test('should return false', () => {
            expect(isAdmin(user)).toBeFalsy();
        })
    })

    describe('given user who is admin', () => {
        let user;
        beforeEach(() => {
            user = {
                roles: [roles.ADMIN]
            }
        })

        test('should return true', () => {
            expect(isAdmin(user)).toBeTruthy();
        })
    })
})

module.exports = isAdminTest;