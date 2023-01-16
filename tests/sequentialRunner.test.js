const userLoginTest = require('./integration/userLogin.test');
const userRegisterTest = require('./integration/userRegister.test');
const getShopByIdTest = require('./integration/getShopById.test');

describe('sequentially run tests', () => {
    userLoginTest();
    userRegisterTest();
    getShopByIdTest();
})