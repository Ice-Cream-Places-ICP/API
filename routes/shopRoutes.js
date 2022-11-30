const { roles } = require('../config/constants');
const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const getUserInfo = require('../middleware/getUserInfo');
const verifyRoles = require('../middleware/verifyRoles');
const addShop = require('../controllers/shopFunctions/addShop');
const updateShop = require('../controllers/shopFunctions/updateShop');
const getAllShops = require('../controllers/shopFunctions/getAllShops');
const getShopById = require('../controllers/shopFunctions/getShopById');
const deleteShop = require('../controllers/shopFunctions/deleteShop');

router.get('/', getAllShops);
router.get('/:id', getShopById);

router.use(verifyToken);
router.use(getUserInfo);

router.post(
    '/',
    verifyRoles(roles.DEFAULT),
    addShop
);

router.patch(
    '/:id', 
    verifyRoles(roles.OWNER, roles.EMPLOYEE), 
    updateShop
);

router.delete(
    '/:id', 
    verifyRoles(roles.OWNER), 
    deleteShop
);

module.exports = router;