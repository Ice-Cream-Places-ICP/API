const User = require('../../models/User');
const sendResponse = require('../../utils/sendResponse.js');
const isAdmin = require('../../utils/isAdmin');
const mongoose = require('mongoose');

const getUser = async (req, res) => {
    const _id = req.params.id;

    if (!_id) {
        const user = await User.findById(req.user._id).populate('shops.id').select('-password -createdAt -updatedAt -__v').exec();

        return res.status(200).json(sendResponse(true, 'Current user retrieved', user));
    }

    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid user id'));
    }

    if (isAdmin(req.user) || _id === req.user._id.toString()) {
        const user = await User.findById(_id).populate('shops.id').select('-password -createdAt -updatedAt -__v').exec();
        if (!user) {
            return res.status(400).json(sendResposne(false, 'User not found'));
        }

        return res.status(200).json(sendResponse(true, 'User retrieved', user));
    }

    return res.status(400).json(sendResponse(false, 'Access denied'));
}

module.exports = getUser;