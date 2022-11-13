const orderComment = require('../../utils/orderComment.js');
const sendResponse = require('../../utils/sendResponse.js');
const jwt = require('jsonwebtoken');
const Shop = require('../../models/shopModel.js');
const User = require('../../models/userModel.js');
const isOwnerOrAdmin = require('../../utils/isOwnerOrAdmin.js');

const deleteShop = async (req, res) => {
	orderComment('delete');

	try {
		let userId = jwt.decode(req.headers.token);

		if (!(await User.findById(userId))) {
			throw "This user doesn't exist";
		}

		if (!(await isOwnerOrAdmin(userId))) {
			throw "This user can't execute this order";
		}

		if (!(await Shop.findById(req.params.shopId))) {
			throw "This shop doesn't exist";
		}

		await Shop.findByIdAndDelete(req.params.shopId);

		console.log('Shop Deleted');
		res.json(sendResponse(true, 'Shop Deleted'));
	} catch (e) {
		console.log(e);
		res.json(sendResponse(false, e));
	}
};

module.exports = deleteShop;
