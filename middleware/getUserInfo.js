const User = require('../models/User');
const Shop = require('../models/Shop');
const { jobPositions } = require('../config/constants');
const mongoose = require('mongoose');
const sendResponse = require('../utils/sendResponse');

const getUserInfo = async (req, res, next) => {
    if (!req.userId || !mongoose.isValidObjectId(req.userId)) {
        return res.status(400).json(sendResponse(false, 'Access denied'));
    }

    const user = await User.findById(req.userId).exec();
    if (!user) {
        return res.status(400).json(sendResponse(false, 'Access denied'));
    }

    let userInfo = {
        id: user._id,
        email: user.email,
        role: user.role,
        occupations: []
    }

    const shops = await Shop.find({ $or: [{ employees: user._id }, { owners: user._id }] }).exec();

    if (!Array.isArray(shops)) shops = [shops];

    for (let i = 0; i < shops.length; i++) {
        if (shops[i].employees.includes(user._id)) {
            userInfo.occupations.push({ shopId: shops[i]._id.toString(), jobPosition: jobPositions.EMPLOYEE })
        } 
        if (shops[i].owners.includes(user._id)) {
            userInfo.occupations.push({ shopId: shops[i]._id.toString(), jobPosition: jobPositions.OWNER })
        }
    }

    req.user = userInfo;
    next();
}

module.exports = getUserInfo;