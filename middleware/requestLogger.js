const logger = require('../utils/logger');
const morgan = require('morgan');

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

const requestLogger = morgan(
    ':method :url :status - :response-time ms',
    {
        stream: {
            write: (message) => logger.http(message),
        },
    }
);

module.exports = requestLogger;