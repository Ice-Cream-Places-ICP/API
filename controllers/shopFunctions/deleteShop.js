const sendResponse = require('../../utils/sendResponse');
const isAdmin = require('../../utils/isAdmin');
const getUserJobPosition = require('../../utils/getUserJobPosition');
const { roles } = require('../../config/constants');
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

    if (getUserJobPosition(req.user.email, shop.employees) !== roles.OWNER && 
        !isAdmin(req.user)) {
            return res.status(400).json(sendResponse(false, 'Access denied'));
        } 

    shop.removedAt = new Date();
    const result = await shop.save();

    res.status(200).json(sendResponse(true, `Shop '${result.name}' deleted`));
}

module.exports = deleteShop;
