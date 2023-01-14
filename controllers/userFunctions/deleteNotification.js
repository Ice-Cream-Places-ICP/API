const mongoose = require('mongoose');
const sendResponse = require('../../utils/sendResponse');

const deleteNotification = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId(id)) {
        return res.status(400).json(sendResponse(false, 'Invalid id'));
    }
    
    const notification = req.user.notifications.find(n => n.id === id);
    const notificationPosition = req.user.notifications.indexOf(notification);
    if (notificationPosition > -1) {
        req.user.notifications.splice(notificationPosition, 1);
    } else {
        return res.status(400).json(sendResponse(false, 'Notification not found'));
    }

    await req.user.save();
    res.status(200).json(sendResponse(true, 'Notification deleted'));
}

module.exports = deleteNotification;