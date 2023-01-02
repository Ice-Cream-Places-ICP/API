const sendResponse = require('../../utils/sendResponse.js');
const Shop = require('../../models/Shop');
const mongoose = require('mongoose');

const deleteShop = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid shop id'));
    }

    const shop = await Shop.findOne({ _id, removedAt: '' });
    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'))
    }

    shop.removedAt = new Date();
    const result = await shop.save();

    res.status(200).json(sendResponse(true, `Shop '${result.name}' deleted`));
}

module.exports = deleteShop;
