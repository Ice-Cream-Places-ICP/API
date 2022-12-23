const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

module.exports = { transport }