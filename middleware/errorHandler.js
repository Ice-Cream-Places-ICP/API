const sendResponse = require('../utils/sendResponse');

const errorHandler = (err, req, res, next) => {
    const status = res.statusCode ? res.statusCode : 500;

    res.status(status).json(sendResponse(false, err.message));
}

module.exports = errorHandler;