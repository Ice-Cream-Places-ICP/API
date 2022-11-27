const sendResponse = require('../utils/sendResponse');
const { roles } = require('../config/constants');

const verifyJobPosition = (...allowedJobPositions) => {
    return async (req, res, next) => {
        let occupation = await req.user.occupations.find(o => o.shopId === req.params.id);
        if (![...allowedJobPositions].includes(occupation?.jobPosition) && req.user.role !== roles.ADMIN) {
            return res.status(400).json(sendResponse(false, 'This action is not permitted'));
        }
        next();
    }
}

module.exports = verifyJobPosition;