const userLoginTest = require('./unit/userLogin.test');
const userRegisterTest = require('./unit/userRegister.test');
const getShopByIdTest = require('./unit/getShopById.test');

describe('sequentially run tests', () => {
    userLoginTest();
    userRegisterTest();
    getShopByIdTest();
})