const sendResponse = require('../../utils/sendResponse');
const Shop = require('../../models/Shop');
const mongoose = require('mongoose');

const getFlavors = async (req, res) => {
    const _id = req.params.id;

    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid shop id'))
    }

    let shop = await Shop.findOne({ _id, removedAt: '' }).exec();

    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'))
    }

    res.status(200).json(sendResponse(true, 'Shop flavors retrieved', shop.flavors));
}

module.exports = getFlavors;