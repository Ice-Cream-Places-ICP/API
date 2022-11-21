const userLoginTest = require('./unit/userLogin.test');
const userRegisterTest = require('./unit/userRegister.test');

describe('sequentially run tests', () => {
    userLoginTest();
    userRegisterTest();
})