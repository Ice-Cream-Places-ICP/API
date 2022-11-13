const express = require('express');
const deleteShop = require('../controllers/shopFunctions/deleteShop.js');
const addShop = require('../controllers/shopFunctions/addShop.js');
const getAllShops = require('../controllers/shopFunctions/getAllShops.js');

const router = express.Router();

router.get('/', getAllShops);
router.post('/add', addShop);
router.delete('/delete/:shopId', deleteShop);

module.exports = router;
