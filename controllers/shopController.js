const mongoose = require('mongoose');
const Shop = require('../models/Shop');
const sendResponse = require('../utils/sendResponse');

const getShops = async (req, res) => {
    const shops = await Shop.find();

    res.status(200).json(sendResponse(true, 'Shops retrieved', shops));
}

const getShop = async (req, res) => {
    const _id = req.params.id;

    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'No such shop'))
    }

    const shop = await Shop.findById({ _id });
    if (!shop) {
        return res.status(400).json(sendResponse(false, 'No such shop'))
    }
    res.status(200).json(sendResponse(true, 'Shop retrieved', shop ));
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
        res.status(200).json(sendResponse(true, 'Shop created', shop));
    } catch (err) {
        res.status(400).json(sendResponse(false, err.message));
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
        return res.status(400).json(sendResponse(false, 'No such shop'));
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
        res.status(200).json(sendResponse(true, 'Shop updated', result));
    } catch (err) {
        res.status(400).json(sendResponse(false, err.message));
    }
}

const deleteShop = async (req, res) => {
const _id = req.params.id;

    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'No such shop'));
    }
    
    try {
        const shop = await Shop.findByIdAndDelete({ _id });
        res.status(200).json(sendResponse(true, 'Shop deleted'));
    } catch (err) {
        res.status(400).json(sendResponse(false, err.message));
    }
}

module.exports = {
    getShops,
    getShop,
    createShop, 
    updateShop, 
    deleteShop
}