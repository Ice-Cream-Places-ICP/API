const User = require('../models/User');
const Shop = require('../models/Shop');
const { jobPositions } = require('../config/constants');
const mongoose = require('mongoose');
const sendResponse = require('../utils/sendResponse');

const getUserInfo = async (req, res, next) => {
    if (!req.userId || !mongoose.isValidObjectId(req.userId)) {
        return res.status(400).json(sendResponse(false, 'Access denied'));
    }

    const user = await User.findById(req.userId).populate('shops.id').select('-password -createdAt -updatedAt -__v').exec()
    if (!user) {
        return res.status(400).json(sendResponse(false, 'Access denied'));
    }

    req.user = user;
    next();
}

module.exports = getUserInfo;