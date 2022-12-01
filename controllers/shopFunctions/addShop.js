const sendResponse = require('../../utils/sendResponse.js');
const arePropertiesSame = require('../../utils/arePropertiesSame');
const Shop = require('../../models/Shop');
const User = require('../../models/User');
const { roles } = require('../../config/constants');
const hasDuplicates = require('../../utils/hasDuplicates.js');

const addShop = async (req, res) => {
    let {
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

    if (duplicate) {
        return res.status(400).json(sendResponse(false, 'Shop already exists'));
    }

    if (hasDuplicates(employees)) {
        return res.status(400).json(sendResponse(false, 'You have added duplicate employees'));
    }

    for (let employee of employees) {
        let user = await User.findOne({ email: employee.email }).exec();

        if (!user) {
            return res.status(400).json(sendResponse(false, `You cannot add user with email: '${employee.email}', because he does not exist`));
        }
    };

    try {
        const creator = req.user.id;
        if (!req.user.roles.includes(roles.ADMIN) &&
            !employees.includes(employees.find(e => e.email === req.user.email))) {
            employees.push({ email: req.user.email, jobPosition: roles.OWNER });
        }

        const shop = new Shop({
            name,
            address,
            openingHours,
            flavors,
            employees,
            creator
        });

        await shop.save();
        res.status(200).json(sendResponse(true, 'Shop created', shop));
    } catch (err) {
        res.status(400).json(sendResponse(false, err.message));
    }
}

module.exports = addShop;
