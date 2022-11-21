const sendResponse = require('../utils/sendResponse');

const errorHandler = (err, req, res, next) => {
    const status = res.statusCode ? res.statusCode : 500;
    
    if (err.type === "entity.parse.failed") {
        return res.status(status).json(sendResponse(false, "Invalid JSON syntax"));
    }
    res.status(status).json(sendResponse(false, err.message));
}

module.exports = errorHandler;