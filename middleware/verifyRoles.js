const sendResponse = require('../utils/sendResponse');
const { roles } = require('../config/constants');

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        let permitted = false;
        allowedRoles.push(roles.ADMIN);
        req?.user?.roles.forEach(role => {
            if (allowedRoles.includes(role)) {
                permitted = true;
                return next();
            }
        })
        if (!permitted) {
            return res.status(400).json(sendResponse(false, 'Access denied'));
        }
    }
}

module.exports = verifyRoles;