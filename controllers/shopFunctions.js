const sendResponse = require('../utils/sendResponse.js');
const Shop = require('../models/shopModel.js');
const jwt = require('jsonwebtoken');

const getAllShops = async (req, res) => {
	console.log('----------------------------------------------');
	console.log('GET ALL SHOPS');

	console.log(req);
};

const addShop = async (req, res) => {
	console.log('----------------------------------------------');
	console.log('ADD SHOP ORDER');

	try {
		let req_token = req.headers.token;
		let req_name = req.body.name;
		let req_address = req.body.address;
		let req_flavors = req.body.flavors;
		let req_openHours = req.body.openHours;

		const owner = jwt.decode(req_token).toString();

		const newShop = new Shop({
			name: req_name,
			address: req_address,
			flavors: req_flavors,
			openHours: req_openHours,
			ownerId: owner,
		});

		console.log('newShop', newShop);

		await newShop.save();

		res.json(sendResponse(true, 'New shop created', newShop));
	} catch (e) {
		console.log(e);
		res.json(sendResponse(false, e));
	}
};

module.exports = { addShop, getAllShops };
