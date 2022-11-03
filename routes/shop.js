const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const getUserInfo = require('../middleware/getUserInfo');
const {
    getShops,
    getShop,
    createShop,
    updateShop,
    deleteShop
} = require('../controllers/shopController');
const verifyUserType = require('../middleware/verifyUserType');
const verifyEmployeeRole = require('../middleware/verifyEmployeeRole');
const { shopRoles, userTypes } = require('../config/constants');

const router = express.Router();

router.get('/', getShops);
router.get('/:id', getShop);

router.use(verifyToken);
router.use(getUserInfo);

router.post(
    '/',
    verifyUserType(userTypes.ADMIN, userTypes.DEFAULT),
    createShop
);

router.patch(
    '/:id', 
    verifyUserType(userTypes.ADMIN, userTypes.DEFAULT), 
    verifyEmployeeRole(shopRoles.OWNER, shopRoles.EMPLOYEE), 
    updateShop
);

router.delete(
    '/:id', 
    verifyUserType(userTypes.ADMIN, userTypes.DEFAULT), 
    verifyEmployeeRole(shopRoles.OWNER), 
    deleteShop
);

// if (req.userInfo.type === 'admin') {
//     router.delete('/:id', deleteShopPermanently);
//     router.put('/:id', restoreDeletedShop);
//     router.get('/', getDeletedShopsWithDetails);
//     router.get('/', getShopsWithDetails);
// }

module.exports = router;