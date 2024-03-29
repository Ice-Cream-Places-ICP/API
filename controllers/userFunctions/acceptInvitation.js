const Shop = require('../../models/Shop');
const mongoose = require('mongoose');
const sendResponse = require('../../utils/sendResponse');
const { employeeStatus } = require('../../config/constants');

const acceptInvitation = async (req, res) => {
    let id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json(sendResponse(false, 'Invalid invitation id'));
    }

    const notification = req.user.notifications.find(notification => notification.id === id)
    if (!notification) {
        return res.status(400).json(sendResponse(false, 'Invitation not found'));
    }

    const shop = await Shop.findById(notification.shop.id).exec();
    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'));
    }

    const employee = shop.employees.find(e => e.email === req.user.email);
    employee.status = employeeStatus.ACTIVE;

    const userShop = {
        id: notification.shop.id,
        jobPosition: notification.shop.jobPosition
    }
    req.user.shops.push(userShop);

    const notificationPosition = req.user.notifications.indexOf(notification);
    req.user.notifications.splice(notificationPosition, 1); 

    await req.user.save();
    await shop.save();

    res.status(200).json(sendResponse(true, 'Invitation accepted'));
}

module.exports = acceptInvitation;