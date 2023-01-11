const User = require('../../models/User');
const Shop = require('../../models/Shop');
const { roles, notificationType, employeeStatus } = require('../../config/constants');
const validator = require('validator');
const mongoose = require('mongoose');
const sendResponse = require('../../utils/sendResponse');
const isEmployeeType = require('../../utils/isEmployeeType');
const getUserJobPosition = require('../../utils/getUserJobPosition');
const isAdmin = require('../../utils/isAdmin');

const sendInvitation = async (req, res) => {
    let {
        email,
        jobPosition,
    } = req.body;

    let id = req.params.id;

    if (!validator.isEmail(email)) {
        return res.status(400).json(sendResponse(false, 'Invalid email'));
    }

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json(sendResponse(false, 'Invalid shop id'));
    }

    if (!isEmployeeType(jobPosition)) {
        return res.status(400).json(sendResponse(false, `'${jobPosition}' is not valid job position`));
    }

    const shop = await Shop.findById(id).exec();
    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'));
    }

    if (!isAdmin(req.user) && getUserJobPosition(req.user.email, shop.employees) !== roles.OWNER) {
        return res.status(400).json(sendResponse(false, 'Access denied'));
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
        return res.status(400).json(sendReponse(false, `User with email '${email}' was not found`));
    }

    const employee = shop.employees.find(e => e.email === email);
    if (employee && employee.status === employeeStatus.PENDING) {
        return res.status(400).json(sendResponse(false, `User with email '${email}' was already invited`));
    }
    
    if (employee && employee.status === employeeStatus.ACTIVE) {
        return res.status(400).json(sendResponse(false, `User with email '${email}' was already added`));
    }

    const newNotification = {
        shop: {
            id: shop.id,
            name: shop.name,
            jobPosition: jobPosition
        },
        type: notificationType.SHOP_INVITATION
    }
    user.notifications.push(newNotification);

    const newEmployee = {
        email: email,
        jobPosition: jobPosition,
        status: employeeStatus.PENDING
    }
    shop.employees.push(newEmployee);

    await user.save();
    await shop.save();
    res.status(200).json(sendResponse(true, `User with email '${email}' was invited to shop '${shop.name}`));
}

module.exports = sendInvitation;