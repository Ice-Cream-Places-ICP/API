const mongoose = require('mongoose');
const Shop = require('../models/Shop');
const sendResponse = require('../utils/sendResponse');

const getShops = async (req, res) => {
    const shops = await Shop.find();

    sendResponse(res, 200, 'Shops retrieved', shops);
}

const getShop = async (req, res) => {
    const _id = req.params.id;

    if (!mongoose.isValidObjectId(_id)) {
        return sendResponse(res, 404, 'No such shop');
    }

    const shop = await Shop.findById({ _id });
    if (!shop) {
        return sendResponse(res, 404, 'No such shop');
    }
    sendResponse(res, 200, 'Shop retrieved', shop)
}

const createShop = async (req, res) => {
    const {
        name,
        address,
        flavors,
        active,
        ownerId,
        creatorId
    } = req.body;

    try {
        const shop = await Shop.create({
            name,
            address,
            flavors,
            active,
            ownerId,
            creatorId
        });
        sendResponse(res, 200, 'Shop created', shop);
    } catch (err) {
        sendResponse(res, 400, err.message);
    }
}

const updateShop = async (req, res) => {
    const _id = req.params.id;
    const {
        name,
        address,
        flavors,
        active,
        ownerId,
        creatorId
    } = req.body;

    if (!mongoose.isValidObjectId(_id)) {
        return sendResponse(res, 404, 'No such shop');
    }

    try {
        let shop = await Shop.findById({ _id });
        shop.name = name;
        shop.address = address;
        shop.flavors = flavors;
        shop.active = active;
        shop.ownerId = ownerId;
        shop.creatorId = creatorId;

        const result = await shop.save();
        sendResponse(res, 200, 'Shop updated', result);
    } catch (err) {
        sendResponse(res, 400, err.message);
    }
}

const deleteShop = async (req, res) => {
const _id = req.params.id;

    if (!mongoose.isValidObjectId(_id)) {
        return sendResponse(res, 404, 'No such shop');
    }
    
    try {
        const shop = await Shop.findByIdAndDelete({ _id });
        sendResponse(res, 200, 'Shop deleted');
    } catch (err) {
        sendResponse(res, 400, err.message);
    }
}

module.exports = {
    getShops,
    getShop,
    createShop, 
    updateShop, 
    deleteShop
}