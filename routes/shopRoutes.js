const express = require('express');
const deleteShop = require('../controllers/shopFunctions/deleteShop.js');
const addShop = require('../controllers/shopFunctions/addShop.js');
const getAllShops = require('../controllers/shopFunctions/getAllShops.js');
const getShopById = require('../controllers/shopFunctions/getShopById.js');
const updateShop = require('../controllers/shopFunctions/updateShop.js');

const router = express.Router();

router.get('/', getAllShops);
router.get('/:shopId', getShopById);
router.post('/add', addShop);
router.put('/update/:shopId', updateShop);
router.delete('/delete/:shopId', deleteShop);

module.exports = router;
