const sendResponse = require('../../utils/sendResponse.js');
const Shop = require('../../models/Shop');
const { roles } = require('../../config/constants');

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

    employees.forEach(async employee => {
        let user = await User.findOne({ email: employee.email }).exec();
        let userShops = user.shops;

        if (!user) {
            return res.status(400).json(sendResponse(false, `You cannot add user with email: '${employee.email}', because he does not exist.`));
        }

        let userShop = userShops.find(s => s.id === doc._id);
        if (userShops.includes(userShop) && employee.jobPosition === userShop.jobPosition) {
            return res.status(400).json(sendResponse(false, `User with email '${employee.email}' was already added.`));
        }
    });

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
