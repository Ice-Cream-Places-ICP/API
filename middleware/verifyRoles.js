const sendResponse = require('../utils/sendResponse');
const { roles } = require('../config/constants');

const verifyRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        if (!allowedRoles.includes(roles.ADMIN)) allowedRoles.push(roles.ADMIN);

        const userRoles = req?.user.roles;
        if (!isPermitted(allowedRoles, userRoles)) {
            return res.status(400).json(sendResponse(false, 'Access denied'));
        }
        next();
    }
}

const isPermitted = (allowedRoles, userRoles) => {
    const intersectionArr = allowedRoles.filter(roles => userRoles.includes(roles));
    return intersectionArr.length > 0 ? true : false;
}

module.exports = verifyRoles;