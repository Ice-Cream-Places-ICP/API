const { allowedOrigins } = require('./constants');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true); 
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, 
    creadentials: true, 
    exposedHeaders: ['Content-Type', 'token'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionSuccessStatus: 200
}

module.exports = corsOptions 