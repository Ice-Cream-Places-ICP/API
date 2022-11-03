const sendResponse = require('../utils/sendResponse');

const verifyEmployeeRole = (...allowedShopRoles) => {
    return async (req, res, next) => {
        const shopRoles = [...allowedShopRoles];
        let occupation = await req.userInfo.occupations.find(o => o.shopId.toString() === req.params.id);
        if (!shopRoles.includes(occupation?.role) && req.userInfo.type !== 'admin') {
            return res.status(400).json(sendResponse(false, 'This action is not permitted'));
        }
        next();
    }
}

module.exports = verifyEmployeeRole;