const express = require('express');
const deleteShop = require('../controllers/shopFunctions/deleteShop.js');
const { addShop, getAllShops } = require('../controllers/shopFunctions/shopFunctions.js');

const router = express.Router();

router.get('/', getAllShops);
router.post('/add', addShop);
router.delete('/delete/:shopId', deleteShop);

module.exports = router;
