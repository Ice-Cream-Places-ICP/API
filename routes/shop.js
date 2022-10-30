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

const router = express.Router();

router.get('/', getShops);
router.get('/:id', getShop);

router.use(verifyToken);
router.use(getUserInfo);

router.post('/', createShop);
router.patch('/:id', updateShop);
router.delete('/:id', deleteShop);

// if (req.userInfo.type === 'admin') {
//     router.delete('/:id', deleteShopPermanently);
//     router.put('/:id', restoreDeletedShop);
//     router.get('/', getDeletedShopsWithDetails);
//     router.get('/', getShopsWithDetails);
// }

module.exports = router;