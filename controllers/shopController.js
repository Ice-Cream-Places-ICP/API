const mongoose = require('mongoose');
const Shop = require('../models/Shop');
const User = require('../models/User');
const Employee = require('../models/Employee');
const sendResponse = require('../utils/sendResponse');
const shopResDto = require('../DTOs/shopResDto');
const shopReqDto = require('../DTOs/shopReqDto');

const getShops = async (req, res) => {
    let shops = await Shop.find({ removedAt: '' })
        .populate({ path: 'creator', select: '-password' })
        .exec();

    if (!shops?.length) {
        return res.status(200).json(sendResponse(true, 'No shops found'));
    }

    shops = shops.map(shop => shopResDto(shop));
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

    shop = shopResDto(shop);
    res.status(200).json(sendResponse(true, 'Shop retrieved', shop));
}

const createShop = async (req, res) => {
    let {
        name,
        address,
        openingHours,
        flavors,
    } = shopReqDto(req.body);

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
        const creator = req.userInfo.id;

        const shop = new Shop({
            name,
            address,
            openingHours,
            flavors,
            creator
        });

        if (req.userInfo.type !== 'admin') {
            const employee = new Employee({
                user: creator,
                shop: shop._id,
                role: 'owner'
            })
            await employee.save();
        }

        await shop.save();

        const createdShop = shopResDto(shop);
        res.status(200).json(sendResponse(true, 'Shop created', createdShop));
    } catch (err) {
        res.status(400).json(sendResponse(false, err.message));
    }
}

const updateShop = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid id'));
    }

    let shop = await Shop.findOne({ _id, removedAt: '' }).exec();

    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'));
    }

    const {
        name,
        address,
        openingHours,
        flavors
    } = shopReqDto(req.body);

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

    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(400).json(sendResponse(false, 'Shop already exists'));
    }

    try {
        shop.name = name;
        shop.address = address;
        shop.openingHours = openingHours;
        shop.flavors = flavors;

        await shop.save();

        const createdShop = shopResDto(shop);
        res.status(200).json(sendResponse(true, 'Shop updated', createdShop));
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