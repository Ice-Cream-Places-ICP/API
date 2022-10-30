const User = require('../models/User');
const Employee = require('../models/Employee');
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
        id: req.userId,
        email: user.email, 
        type: user.type
    }

    const employee = await Employee.find({ user: user._id }).exec();
    if (!employee) {
        req.userInfo = userInfo;
        return next();
    }

    let occupations = [];
    if (Array.isArray(employee)) {
        employee.forEach(e => {
            occupations.push({
                shopId: e.shop,
                role: e.role
            });
        })
    } else {
        occupations.push({
            shopId: employee.shop,
            role: employee.role
        });
    }

    userInfo.occupations = occupations;
    req.userInfo = userInfo;
    next();
}

module.exports = getUserInfo;