const orderComment = require('../../utils/orderComment');
const sendResponse = require('../../utils/sendResponse');
const Shop = require('../../models/shopModel.js');

const getShopById = async (req, res) => {
	orderComment('get by id');
	try {
		const shop = await Shop.findById(req.params.shopId);
		res.json(sendResponse(true, 'Shop info in content', shop));
		console.log(shop);
	} catch (err) {
		res.json(sendResponse(false, err));
	}
};

module.exports = getShopById;
