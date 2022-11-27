const sendResponse = require('../utils/sendResponse');

const verifyUser = (...allowedRoles) => {
    return (req, res, next) => {
        if (![...allowedRoles].includes(req?.user?.role)) {
            return res.status(400).json(sendResponse(false, 'This action is not permitted'))
        }
        next();
    }
}

module.exports = verifyUser;