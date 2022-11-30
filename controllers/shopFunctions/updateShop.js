const sendResponse = require('../../utils/sendResponse');
const Shop = require('../../models/Shop');
const User = require('../../models/User');
const mongoose = require('mongoose');
const { roles } = require('../../config/constants');

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

    if (JSON.stringify(employees) !== JSON.stringify(shop.employees)) { 
        employees.forEach(async employee => {
            let user = await User.findOne({ email: employee.email }).exec();
            let userShops = user.shops;

            if (!employees.includes(employees.find(e => e.email === req.user.email))) {
                return res.status(400).json(sendResponse(false, `As owner you cannot remove yourself from employee list`));
            }

            if (!user) {
                return res.status(400).json(sendResponse(false, `You cannot add user with email: '${employee.email}', because he does not exist`));
            }

            let userShop = userShops.find(s => s.id === doc._id);
            if (userShops.includes(userShop) && employee.jobPosition === userShop.jobPosition) {
                return res.status(400).json(sendResponse(false, `User with email '${employee.email}' was already added`));
            }
        });
    }

    try {
        if (!req.user.roles.includes(roles.ADMIN) && 
            !employees.includes(employees.find(e => e.email === req.user.email))) {
            employees.push({ email: req.user.email, jobPosition: roles.OWNER });
        }

        shop.name = name;
        shop.address = address;
        shop.openingHours = openingHours;
        shop.flavors = flavors;
        shop.employees = employees;
        shop.updatedAt = new Date();

        await shop.save();

        res.status(200).json(sendResponse(true, `Shop '${shop.name}' updated`, shop));
    } catch (err) {
        res.status(400).json(sendResponse(false, err.message));
    }
}
module.exports = updateShop;
