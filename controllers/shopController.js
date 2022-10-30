const mongoose = require('mongoose');
const Shop = require('../models/Shop');
const User = require('../models/User');
const Employee = require('../models/Employee');
const sendResponse = require('../utils/sendResponse');
const shopDto = require('../DTOs/shopDto');

const getShops = async (req, res) => {
    let shops = await Shop.find({ removedAt: '' })
        .populate({ path: 'creator', select: '-password' })
        .exec();

    if (!shops?.length) {
        return res.status(200).json(sendResponse(true, 'No shops found'));
    }

    shops = shops.map(shop => shopDto(shop));
    res.status(200).json(sendResponse(true, 'Shops retrieved', shops));
}

const getShop = async (req, res) => {
    const _id = req.params.id;

    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid id'))
    }

    let shop = await Shop.findOne({ _id, removedAt: '' })
        .populate({ path: 'creator', select: '-password' })
        .exec();

    if (!shop) {
        return res.status(400).json(sendResponse(false, 'No such shop'))
    }

    shop = shopDto(shop);
    res.status(200).json(sendResponse(true, 'Shop retrieved', shop));
}

const createShop = async (req, res) => {
    let {
        name,
        address,
        flavors,
    } = req.body;

    if (!name || !address.country || !address.city || !address.postCode ||
        !address.streetName || !address.streetNumber) {
        return res.status(400).json(sendResponse(false, 'All fields required'));
    }

    const duplicate = await Shop.findOne({
        name, 'address.country': address.country, 'address.city': address.city,
        'address.postCode': address.postCode, 'address.streetName': address.streetName,
        'address.streetNumber': address.streetNumber, removedAt: ''
    })
        .lean()
        .exec();

    if (duplicate) {
        return res.status(400).json(sendResponse(false, 'Shop already exists'));
    }

    try {
        let creator = req.userInfo.id;

        let shopObject = {
            name,
            address,
            flavors,
            creator
        };

        let shop = await Shop.create(shopObject);

        if (req.userType !== 'admin') {
            await Employee.create({
                user: creator,
                shop: shop._id,
                role: 'owner'
            })
        }

        if (req.userInfo.type !== 'admin') {
            console.log(req.userInfo.type);
            shop = shopDto(shop);
        }

        res.status(200).json(sendResponse(true, 'Shop created', shop));
    } catch (err) {
        res.status(400).json(sendResponse(false, err.message));
    }
}

const updateShop = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid id'));
    }

    let shop;
    if (req.userInfo.type !== 'admin') {
        shop = await Shop.findOne({ _id, removedAt: '' });
    }
    else {
        shop = await Shop.findById(_id);
    }

    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'));
    }

    const {
        name,
        address,
        flavors,
        creator
    } = req.body;

    if (!name || !address.country || !address.city || !address.postCode ||
        !address.streetName || !address.streetNumber) {
        return res.status(400).json(sendResponse(false, 'All fields required'));
    }

    if (creator && !mongoose.isValidObjectId(creator)) {
        return res.status(400).json(sendResponse(false, 'Invalid creator id'));
    }

    const duplicate = await Shop.findOne({
        name, 'address.country': address.country, 'address.city': address.city,
        'address.postCode': address.postCode, 'address.streetName': address.streetName,
        'address.streetNumber': address.streetNumber, removedAt: ''
    })
        .lean()
        .exec();

    if (duplicate) {
        return res.status(400).json(sendResponse(false, 'Shop already exists'));
    }

    try {
        if (creator) {
            if (shop.creator !== creator && req.userInfo.type !== 'admin') {
                return res.status(400).json(sendResponse(false, 'Creator cannot be modified'));
            }
            shop.creator = creator;
        } 

        shop.name = name;
        shop.address = address;
        shop.flavors = flavors;

        let result = await shop.save();

        if (req.userInfo.type !== 'admin') {
            result = shopDto(result);
        }
        res.status(200).json(sendResponse(true, 'Shop updated', result));
    } catch (err) {
        res.status(400).json(sendResponse(false, err.message));
    }
}

const deleteShop = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid id'));
    }

    const shop = await Shop.findOne({ _id, removedAt: '' });
    if (!shop) {
        return res.status(400).json(sendResponse(false, 'No such shop'))
    }

    try {
        shop.removedAt = new Date();
        const result = await shop.save();

        res.status(200).json(sendResponse(true, `Shop '${result.name}' deleted`));
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