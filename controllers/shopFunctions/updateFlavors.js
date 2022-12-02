const sendResponse = require('../../utils/sendResponse');
const hasDuplicates = require('../../utils/hasDuplicates');
const Shop = require('../../models/Shop');
const validator = require('validator');
const mongoose = require('mongoose');

const updateFlavors = async (req, res) => {
    const flavors = req.body;
    const _id = req.params.id;

    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid shop id'));
    }

    const shop = await Shop.findOne({ _id, removedAt: '' }).exec();

    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'));
    }

    if (hasDuplicates(flavors)) {
        return res.status(400).json(sendResponse(false, `Flavors list cannot have duplicates`));
    }

    for (let i = 0; i < flavors.length; i++) {
        if (!flavors[i].name || !flavors[i].available) {
            return res.status(400).json(sendResponse(false, 'Flavor object must have all fields specified'));
        }
        if (!validator.isAlpha(flavors[i].name, ['pl-PL'])) {
            return res.status(400).json(sendResponse(false, `Flavor ${flavors[i].name} contains characters that are not allowed`));
        }
    }

    shop.flavors = flavors;
    await shop.save();
    return res.status(200).json(sendResponse(true, `Shop '${shop.name}' flavors updated`, shop.flavors));
}

module.exports = updateFlavors; 