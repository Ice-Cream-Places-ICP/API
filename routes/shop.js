const express = require('express');
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
router.post('/', createShop);
router.patch('/:id', updateShop);
router.delete('/:id', deleteShop);

module.exports = router;