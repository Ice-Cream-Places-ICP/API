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
const updateFlavors = require('../controllers/shopFunctions/updateFlavors');
const getFlavors = require('../controllers/shopFunctions/getFlavors');
const addReview = require('../controllers/shopFunctions/addReview');
const deleteReview = require('../controllers/shopFunctions/deleteReview');
const updateReview = require('../controllers/shopFunctions/updateReview');

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
    verifyRoles(roles.OWNER), 
    updateShop
);

router.patch(
    '/:id/flavors',
    verifyRoles(roles.OWNER, roles.EMPLOYEE),
    updateFlavors
)

router.delete(
    '/:id', 
    verifyRoles(roles.OWNER), 
    deleteShop
);

router.post(
    '/:id/review',
    verifyRoles(roles.DEFAULT),
    addReview
);

router.delete(
    '/:shopId/review/:reviewId',
    verifyRoles(roles.DEFAULT),
    deleteReview
)

router.patch(
    '/:shopId/review/:reviewId',
    verifyRoles(roles.DEFAULT),
    updateReview
)

module.exports = router;