const { jobPositions, roles } = require('../config/constants');
const router = require('express').Router();
const shopContoller = require('../controllers/shopController');
const verifyToken = require('../middleware/verifyToken');
const getUserInfo = require('../middleware/getUserInfo');
const verifyUser = require('../middleware/verifyUser');
const verifyJobPosition = require('../middleware/verifyJobPosition');

router.get('/', shopContoller.getShops);
router.get('/:id', shopContoller.getShop);

router.use(verifyToken);
router.use(getUserInfo);

router.post(
    '/',
    verifyUser(roles.ADMIN, roles.DEFAULT),
    shopContoller.createShop
);

router.patch(
    '/:id', 
    verifyUser(roles.ADMIN, roles.DEFAULT), 
    verifyJobPosition(jobPositions.OWNER, jobPositions.EMPLOYEE), 
    shopContoller.updateShop
);

router.delete(
    '/:id', 
    verifyUser(roles.ADMIN, roles.DEFAULT), 
    verifyJobPosition(jobPositions.OWNER), 
    shopContoller.deleteShop
);

// if (req.userInfo.type === 'admin') {
//     router.delete('/:id', deleteShopPermanently);
//     router.put('/:id', restoreDeletedShop);
//     router.get('/', getDeletedShopsWithDetails);
//     router.get('/', getShopsWithDetails);
// }

module.exports = router;