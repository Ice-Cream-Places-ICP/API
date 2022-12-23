const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const getUserInfo = require('../middleware/getUserInfo');
const getUser = require('../controllers/userFunctions/getUser');
const updateUser = require('../controllers/userFunctions/updateUser');
const getAllUsers = require('../controllers/userFunctions/getAllUsers');
const verifyRoles = require('../middleware/verifyRoles');
const { roles } = require('../config/constants');

router.use(verifyToken);
router.use(getUserInfo);

router.get(
    '/all',
    verifyRoles(roles.ADMIN),
    getAllUsers
)

router.get(
    '/:id?',
    getUser
)

router.patch(
    '/:id?', 
    updateUser
)

module.exports = router;