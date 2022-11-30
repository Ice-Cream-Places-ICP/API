const jwt = require('jsonwebtoken');
const sendResponse = require('../utils/sendResponse');

const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization || req.headers.Authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
        return res.status(400).json(sendResponse(false, 'Access denied'));
    }

    jwt.verify(
        authorizationHeader.split(' ')[1],
        process.env.TOKEN_SECRET, 
        (err, decoded) => {
            if (err) {
                return res.status(400).json(sendResponse(false, err.message));
            }
            req.userId = decoded;
            next();
        }
    )
}

module.exports = verifyToken;