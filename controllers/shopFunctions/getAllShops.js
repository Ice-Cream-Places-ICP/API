const Shop = require('../../models/shopModel.js');
const sendResponse = require('../../utils/sendResponse.js');
const orderComment = require('../../utils/orderComment');

const getAllShops = async (req, res) => {
	orderComment("'get all shop'");

	const allShops = await Shop.find({});

	res.json(sendResponse(true, 'That all what we have', allShops));
};

module.exports = getAllShops;
