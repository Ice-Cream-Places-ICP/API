const { roles } = require('../config/constants');
const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const getUserInfo = require('../middleware/getUserInfo');
const verifyRoles = require('../middleware/verifyRoles');
const getUser = require('../controllers/userFunctions/getUser');

router.get(
    '/:id?',
    verifyToken,
    getUserInfo,
    getUser
)

module.exports = router;