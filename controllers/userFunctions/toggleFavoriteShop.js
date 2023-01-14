const Shop = require('../../models/Shop');
const sendResponse = require('../../utils/sendResponse');
const mongoose = require('mongoose');

const toggleFavoriteShop = async (req, res) => {
    const shopId = req.params.shopId;

    if (!mongoose.isValidObjectId(shopId)) {
        return res.status(400).json(sendResponse(false, 'Invalid shop id'));
    }

    const shop = await Shop.findById(shopId).exec();
    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'));
    }

    let responseMessage;
    if (req.user.favoriteShops.includes(shop.id)) {
        const shopPosition = req.user.favoriteShops.indexOf(shop.id);
        req.user.favoriteShops.splice(shopPosition, 1);
        responseMessage = 'Shop removed from user favorites';
    } else {
        req.user.favoriteShops.push(shop.id);
        responseMessage = 'Shop added to user favorites'
    }

    await req.user.save();
    return res.status(200).json(sendResponse(true, responseMessage));
}

module.exports = toggleFavoriteShop;