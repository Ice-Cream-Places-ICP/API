const userLoginTest = require('./integration/userLogin.test');
const userRegisterTest = require('./integration/userRegister.test');
const getShopByIdTest = require('./integration/getShopById.test');
const isAdminTest = require('./unit/isAdmin.test');
const hasDuplicatesTest = require('./unit/hasDuplicates.test');
const openingHoursOverflowTest = require('./unit/openingHoursOverflow.test');

describe('Run tests sequentially', () => {
    describe('Integration tests:', () => {
        userLoginTest();
        userRegisterTest();
        getShopByIdTest();
    })
    describe('Unit tests', () => {
        isAdminTest();
        hasDuplicatesTest();
        openingHoursOverflowTest();
    })
})