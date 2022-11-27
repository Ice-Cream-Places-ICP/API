const mongoose = require('mongoose');
const Shop = require('../models/Shop');
const { roles } = require('../config/constants');
const sendResponse = require('../utils/sendResponse');

const getShops = async (req, res) => {
    let shops = await Shop.find({ removedAt: '' }).exec();

    if (!shops?.length) {
        return res.status(200).json(sendResponse(true, 'No shops found'));
    }

    res.status(200).json(sendResponse(true, 'Shops retrieved', shops));
}

const getShop = async (req, res) => {
    const _id = req.params.id;

    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid shop id'))
    }

    let shop = await Shop.findOne({ _id, removedAt: '' }).exec();

    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'))
    }

    res.status(200).json(sendResponse(true, 'Shop retrieved', shop));
}

const createShop = async (req, res) => {
    let {
        name,
        address,
        openingHours,
        flavors,
        owners,
        employees
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
        const creator = req.user.id;
        if (req.user.role !== roles.ADMIN) {
            owners.push(mongoose.Types.ObjectId(req.user.id));
        }

        const shop = new Shop({
            name,
            address,
            openingHours,
            flavors,
            owners,
            employees,
            creator
        });

        await shop.save();
        res.status(200).json(sendResponse(true, 'Shop created', shop));
    } catch (err) {
        res.status(400).json(sendResponse(false, err.message));
    }
}

const updateShop = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid shop id'));
    }

    let shop = await Shop.findOne({ _id, removedAt: '' }).exec();

    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'));
    }

    const {
        name,
        address,
        openingHours,
        flavors,
        owners, 
        employees
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

    if (duplicate && duplicate?._id.toString() !== _id) {
        return res.status(400).json(sendResponse(false, 'Shop already exists'));
    }

    try {
        shop.name = name;
        shop.address = address;
        shop.openingHours = openingHours;
        shop.flavors = flavors;
        shop.owners = owners;
        shop.employees = employees;

        await shop.save();

        res.status(200).json(sendResponse(true, `Shop ${shop.name} updated`, shop));
    } catch (err) {
        res.status(400).json(sendResponse(false, err.message));
    }
}

const deleteShop = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid shop id'));
    }

    const shop = await Shop.findOne({ _id, removedAt: '' });
    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'))
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