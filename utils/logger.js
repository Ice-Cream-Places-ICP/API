const winston = require('winston');

const { combine, colorize, simple } = winston.format;

global.logger = winston.createLogger({
    levels: winston.config.npm.levels, 
    transports: [
        new winston.transports.Console({
            level: 'silly',
            format: combine(
                colorize(),
                simple()
            ),
        }),
    ],
});

module.exports = logger;
