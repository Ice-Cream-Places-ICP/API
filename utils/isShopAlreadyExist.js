const Shop = require('../models/shopModel');

// TODO: write unit test for this function
const isShopAlreadyExist = async shop => {
	const existingShop = await Shop.find({
		name: shop.name,
	});

	if (!existingShop) {
		return false;
	}

	if (
		existingShop.name == shop.name &&
		existingShop.address.city == shop.address.city &&
		existingShop.address.street == shop.address.street &&
		existingShop.address.number == shop.address.number
	) {
		return true;
	}
};
