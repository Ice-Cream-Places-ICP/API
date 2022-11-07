const express = require('express');
const { addShop, getAllShops } = require('../controllers/shopFunctions.js');

const router = express.Router();

router.get('/', getAllShops);
router.post('/add', addShop);

module.exports = router;
