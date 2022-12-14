const sendResponse = require('../../utils/sendResponse');
const arePropertiesSame = require('../../utils/arePropertiesSame');
const isAdmin = require('../../utils/isAdmin');
const Shop = require('../../models/Shop');
const User = require('../../models/User');
const mongoose = require('mongoose');
const { roles } = require('../../config/constants');
const hasDuplicates = require('../../utils/hasDuplicates');
const getUserJobPosition = require('../../utils/getUserJobPosition');

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
        employees
    } = req.body;

    if (!name || !address.country || !address.city || !address.postCode ||
        !address.streetName || !address.streetNumber) {
        return res.status(400).json(sendResponse(false, 'All fields required'));
    }

    if (getUserJobPosition(req.user.email, shop.employees) !== roles.OWNER &&
        !isAdmin(req.user)) {
        return res.status(400).json(sendResponse(false, 'Access denied'))
    }

    if (!employees.find(e => e.email === req.user.email) &&
        !isAdmin(req.user)) {
            return res.status(400).json(sendResponse(false, 'As owner you cannot remove yourself from employee list'));
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

    if (hasDuplicates(employees)) {
        return res.status(400).json(sendResponse(false, 'You have added duplicate employees'));
    }

    if (!arePropertiesSame(employees, shop.employees)) {
        for (let employee of employees) {
            let user = await User.findOne({ email: employee.email }).exec();

            if (!user) {
                return res.status(400).json(sendResponse(false, `You cannot add user with email: '${employee.email}', because he does not exist`));
            }

            if (!isAdmin(user) && 
                getUserJobPosition(user.email, shop.employees) === roles.OWNER && 
                getUserJobPosition(user.email, employees) !== roles.OWNER) {
                return res.status(400).json(sendResponse('You cannot downgrade owners\'s job position'));
            }
        };
    }

    shop.name = name;
    shop.address = address;
    shop.openingHours = openingHours;
    shop.flavors = flavors;
    shop.employees = employees;
    shop.updatedAt = new Date();

    await shop.save();

    res.status(200).json(sendResponse(true, `Shop '${shop.name}' updated`, shop));
}

module.exports = updateShop;
