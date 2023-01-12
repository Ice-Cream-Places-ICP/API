const Shop = require('../../models/Shop');
const User = require('../../models/User');
const mongoose = require('mongoose');
const sendResponse = require('../../utils/sendResponse');
const getUserJobPosition = require('../../utils/getUserJobPosition');
const isAdmin = require('../../utils/isAdmin');
const { notificationType, employeeStatus, roles } = require('../../config/constants');

const deleteEmployee = async (req, res) => {
    let {
        id,
        email,
    } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json(sendResponse(false, 'Invalid invitation id'));
    }

    const shop = await Shop.findById(id).exec();
    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'));
    }

    if (!isAdmin(req.user) &&
        getUserJobPosition(req.user.email, shop.employees) !== roles.OWNER) {
        return res.status(400).json(sendResponse(false, 'Access denied'));
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
        return res.status(400).json(sendResponse(false, 'User not found'));
    }

    const employee = shop.employees.find(e => e.email === email);
    if (!employee) {
        return res.status(400).json(sendResponse(false, 'Employee not found'));
    }

    if (employee.jobPosition === roles.OWNER && employee.status === employeeStatus.ACTIVE) {
        return res.status(400).json(sendResponse(false, `Owner cannot be removed from shop`));
    }

    if (employee.status !== employeeStatus.ACTIVE) {
        const notification = user?.notifications?.find(n => n.shop.id === shop.id && n.type === notificationType.SHOP_INVITATION)
        if (notification) {
            const notificationPosition = user.notifications.indexOf(notification);
            if (notificationPosition > -1) {
                user.notifications.splice(notificationPosition, 1);
            }
        }
    }

    const employeePosition = shop.employees.indexOf(employee);
    shop.employees.splice(employeePosition, 1);

    await user.save();
    await shop.save();

    res.status(200).json(sendResponse(true, 'Employee deleted'));
}

module.exports = deleteEmployee;