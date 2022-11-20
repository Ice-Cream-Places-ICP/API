const sendResponse = require('../../utils/sendResponse');
const isOwnerOrAdmin = require('../../utils/isOwnerOrAdmin.js');
const orderComment = require('../../utils/orderComment');
const jwt = require('jsonwebtoken');
const Shop = require('../../models/shopModel.js');

const updateShop = async (req, res) => {
	orderComment('update');
	try {
		const userId = jwt.decode(req.headers.token);

		if (!(await isOwnerOrAdmin(userId))) {
			throw 'Something is wrong with this user';
		}

		const shopId = req.params.id;
		const updateContent = req.body;

		await Shop.updateOne({ _id: shopId }, updateContent);

		res.json(sendResponse(true, 'Shop updated'));
	} catch (err) {
		console.log(err);
		res.json(sendResponse(false, err));
	}
};
module.exports = updateShop;
