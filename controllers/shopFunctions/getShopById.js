const orderComment = require('../../utils/orderComment');
const sendResponse = require('../../utils/sendResponse');
const Shop = require('../../models/shopModel.js');
const mongoose = require('mongoose');

const getShopById = async (req, res) => {
	try {
		if (!mongoose.isValidObjectId(req.params.id)) {
			return res.status(400).json(sendResponse(false, 'Invalid id'));
		}

		const shop = await Shop.findById(req.params.id);
		if (!shop) {
			return res.status(400).json(sendResponse(false, 'Shop not found'));
		}
		
		res.json(sendResponse(true, 'Shop succesfully retrieved', shop));
	} catch (err) {
		res.json(sendResponse(false, err));
	}
};

module.exports = getShopById;
