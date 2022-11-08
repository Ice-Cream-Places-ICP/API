const orderComment = require('../../utils/orderComment.js');
const sendResponse = require('../../utils/sendResponse.js');
const jwt = require('jsonwebtoken');
const Shop = require('../../models/shopModel.js');
const User = require('../../models/userModel.js');

const deleteShop = async (req, res) => {
	orderComment('delete');

	try {
		//TODO: validation to check does user can delete shop - is owner or admin
		let userId = jwt.decode(req.headers.token);
		let shopId = req.params.shopId;

		console.log(await User.findById(userId));
		console.log(await Shop.findById(shopId));

		if (!(await User.findById(userId))) {
			throw "This user doesn't exist";
		}

		if (!(await Shop.findById(shopId))) {
			throw "This shop doesn't exist";
		}

		await Shop.findByIdAndDelete(shopId);

		res.json(sendResponse(true, 'Shop Deleted'));
	} catch (e) {
		console.log(e);
		res.json(sendResponse(false, e));
	}
};

module.exports = deleteShop;
