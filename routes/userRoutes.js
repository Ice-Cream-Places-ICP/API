const { roles } = require('../config/constants');
const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const getUserInfo = require('../middleware/getUserInfo');
const verifyRoles = require('../middleware/verifyRoles');
const getUser = require('../controllers/userFunctions/getUser');
const addFavoriteFlavor = require('../controllers/userFunctions/addFavoriteFlavor');
const deleteFavoriteFlavor = require('../controllers/userFunctions/deleteFavoriteFlavor');

router.get(
    '/:id?',
    verifyToken,
    getUserInfo,
    getUser
)

router.patch(
    '/flavors', 
    verifyToken,
    getUserInfo,
    addFavoriteFlavor
)

router.delete(
    '/flavors/:flavorName', 
    verifyToken,
    getUserInfo,
    deleteFavoriteFlavor
)

module.exports = router;