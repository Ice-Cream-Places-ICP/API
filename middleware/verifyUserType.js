const sendResponse = require('../utils/sendResponse');

const verifyUserType = (...allowedUserTypes) => {
    return (req, res, next) => {
        const userTypes = [...allowedUserTypes];
        if (!userTypes.includes(req?.userInfo?.type)) {
            return res.status(400).json(sendResponse(false, 'This action is not permitted'))
        }
        next();
    }
}

module.exports = verifyUserType;