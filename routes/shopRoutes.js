const express = require('express');
const deleteShop = require('../controllers/shopFunctions/deleteShop.js');
const addShop = require('../controllers/shopFunctions/addShop.js');
const getAllShops = require('../controllers/shopFunctions/getAllShops.js');
const getShopById = require('../controllers/shopFunctions/getShopById.js');
const updateShop = require('../controllers/shopFunctions/updateShop.js');

const router = express.Router();

router.get('/', getAllShops);
router.get('/:id', getShopById);
router.post('/', addShop);
router.put('/:id', updateShop);
router.delete('/:id', deleteShop);

module.exports = router;
