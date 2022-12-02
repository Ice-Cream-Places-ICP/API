const { roles } = require('../config/constants');
const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const getUserInfo = require('../middleware/getUserInfo');
const verifyRoles = require('../middleware/verifyRoles');
const addShop = require('../controllers/shopFunctions/addShop');
const updateShop = require('../controllers/shopFunctions/updateShop');
const getAllShops = require('../controllers/shopFunctions/getAllShops');
const getShopById = require('../controllers/shopFunctions/getShopById');
const updateFlavors = require('../controllers/shopFunctions/updateFlavors');
const getFlavors = require('../controllers/shopFunctions/getFlavors');

router.get('/', getAllShops);
router.get('/:id', getShopById);
router.get('/:id/flavors', getFlavors);

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

router.patch(
    '/:id/flavors',
    verifyRoles(roles.OWNER, roles.EMPLOYEE),
    updateFlavors
)

module.exports = router;