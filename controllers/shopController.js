const mongoose = require('mongoose');
const Shop = require('../models/Shop');
const User = require('../models/User');
const Employee = require('../models/Employee');
const sendResponse = require('../utils/sendResponse');

const getShops = async (req, res) => {
    const shops = await Shop.find()
    .populate('creator')
    .exec();

    if (!shops?.length) {
        return res.status(200).json(sendResponse(true, 'No shops found'));
    }

    res.status(200).json(sendResponse(true, 'Shops retrieved', shops));
}

const getShop = async (req, res) => {
    const _id = req.params.id;

    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid id'))
    }

    const shop = await Shop.findById({ _id })
    .populate('creator')
    .exec();

    if (!shop) {
        return res.status(400).json(sendResponse(false, 'No such shop'))
    }
    res.status(200).json(sendResponse(true, 'Shop retrieved', shop));
}

const createShop = async (req, res) => {
    let {
        name,
        address,
        flavors,
        active,
        creator
    } = req.body;

    if (!mongoose.isValidObjectId(creator)) {
        return res.status(400).json(sendResponse(false, 'Invalid creator id'));
    }

    const foundCreator = await User.findById(creator).lean().exec();
    if (!foundCreator) {
        return res.status(400).json(sendResponse(false, 'Creator does not exist'))
    }

    if (!name || !address.country || !address.city || !address.postCode ||
        !address.streetName || !address.streetNumber || !creator) {
        return res.status(400).json(sendResponse(false, 'All fields required'));
    }

    const duplicate = await Shop.findOne({  
        name, 'address.country': address.country, 'address.city': address.city, 
        'address.postCode': address.postCode, 'address.streetName': address.streetName,
        'address.streetNumber': address.streetNumber })
        .lean()
        .exec();

    if (duplicate) {
        return res.status(400).json(sendResponse(false, 'Shop already exists'));
    }

    try {
        if (foundCreator.type !== 'admin') {
            active = false;
        }

        const shop = await Shop.create({
            name,
            address,
            flavors,
            active,
            creator
        });

        if (foundCreator.type !== 'admin') {
            await Employee.create({
                user: creator,
                shop: shop._id,
                role: 'owner'
            })
        }
        res.status(200).json(sendResponse(true, `Shop '${shop.name}' created`, shop));
    } catch (err) {
        res.status(400).json(sendResponse(false, err.message));
    }
}

const updateShop = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid id'));
    }

    let shop = await Shop.findById({ _id });
    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'));
    }

    const {
        name,
        address,
        flavors,
        active,
        creator
    } = req.body;

    if (!name || !address.country || !address.city || !address.postCode ||
        !address.streetName || !address.streetNumber || !creator) {
        return res.status(400).json(sendResponse(false, 'All fields required'));
    }

    if (!mongoose.isValidObjectId(creator)) {
        return res.status(400).json(sendResponse(false, 'Invalid creator id'));
    }

    const foundCreator = await User.findById(creator).lean().exec();
    if (!foundCreator) {
        return res.status(400).json(false, 'Creator does not exist')
    }

    const duplicate = await Shop.findOne({  
        name, 'address.country': address.country, 'address.city': address.city, 
        'address.postCode': address.postCode, 'address.streetName': address.streetName,
        'address.streetNumber': address.streetNumber })
        .lean()
        .exec();

    if (duplicate) {
        return res.status(400).json(sendResponse(false, 'Shop already exists'));
    }

    try {
        if (foundCreator.type !== 'admin' && shop.creator !== creator) {
            return res.status(400).json(sendResponse(false, 'User cannot change creator'));
        } else {
            shop.creator = creator;
        }

        shop.name = name;
        shop.address = address;
        shop.flavors = flavors;
        shop.active = active;

        const result = await shop.save();
        res.status(200).json(sendResponse(true, `Shop '${shop.name}' updated`, result));
    } catch (err) {
        res.status(400).json(sendResponse(false, err.message));
    }
}

const deleteShop = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json(sendResponse(false, 'Invalid id'));
    }

    const shop = await Shop.findById(id);
    if (!shop) {
        return res.status(400).json(sendResponse(false, 'No such shop'))
    }

    try {
        const result = await shop.delete();
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