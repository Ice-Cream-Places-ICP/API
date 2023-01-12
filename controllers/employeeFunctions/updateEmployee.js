const User = require('../../models/User');
const Shop = require('../../models/Shop');
const { roles, notificationType, employeeStatus } = require('../../config/constants');
const validator = require('validator');
const mongoose = require('mongoose');
const sendResponse = require('../../utils/sendResponse');
const isEmployeeType = require('../../utils/isEmployeeType');
const getUserJobPosition = require('../../utils/getUserJobPosition');
const isAdmin = require('../../utils/isAdmin');

const updateEmployee = async (req, res) => {
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
    if (!employee) {
        return res.status(400).json(sendResponse(false, `User with email '${email}' is not employee`));
    }
    
    if (employee.jobPosition === roles.OWNER) {
        return res.status(400).json(sendResponse(false, `Owner position cannot be modified by other employee`));
    }

    if (employee.status !== employeeStatus.ACTIVE) {
        const notification = user.notifications.find(n => n.shop.id === shop.id && notificationType.SHOP_INVITATION);
        if (!notification) {
            const newNotification = {
                shop: {
                    id: shop.id,
                    name: shop.name,
                    jobPosition: jobPosition
                },
                type: notificationType.SHOP_INVITATION
            }
            user.notifications.push(newNotification);
        } else {
            notification.shop.jobPosition = jobPosition;
        }
    }

    employee.jobPosition = jobPosition;

    await user.save();
    await shop.save();
    res.status(200).json(sendResponse(true, `User with email '${email}' was promoted to '${jobPosition}`));
}

module.exports = updateEmployee;