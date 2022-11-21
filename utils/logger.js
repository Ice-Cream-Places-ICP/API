const winston = require('winston');
const path = require('path');

const { combine, timestamp, json, colorize, simple } = winston.format;

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
        new winston.transports.File({
            level: 'http',
            filename: path.join(__dirname, '..', 'logs', 'logs.txt'),
            format: combine(
                timestamp({
                    format: 'YYYY-MM-DD hh:mm:ss.SSS A',
                }),
                json()
            )
        })
    ],
});

module.exports = logger;