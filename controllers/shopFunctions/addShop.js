const sendResponse = require('../../utils/sendResponse.js');
const Shop = require('../../models/shopModel.js');
const jwt = require('jsonwebtoken');
const isOwnerOrAdmin = require('../../utils/isOwnerOrAdmin.js');
const orderComment = require('../../utils/orderComment');

const addShop = async (req, res) => {
	orderComment("'add shop order'");
	try {
		const ownerId = jwt.decode(req.headers.token).toString();

		if (!(await isOwnerOrAdmin(ownerId))) {
			throw 'This user is not an owner';
		}

		let req_name = req.body.name;
		let req_address = req.body.address;
		let req_flavors = req.body.flavors;
		let req_openHours = req.body.openHours;

		const newShop = new Shop({
			name: req_name,
			address: req_address,
			flavors: req_flavors,
			openHours: req_openHours,
			ownerId: ownerId,
		});

		console.log('newShop', newShop);

		await newShop.save();
		res.json(sendResponse(true, 'New shop created', newShop));
	} catch (e) {
		console.log(e);
		res.json(sendResponse(false, e));
	}
};

module.exports = addShop;
