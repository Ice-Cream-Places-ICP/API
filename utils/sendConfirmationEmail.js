const { transport } = require('../config/mailerConfig');

const sendConfirmationEmail = (email, confirmationCode) => {
    transport.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Welcome to Ice Cream Places! Please confirm your account",
        html: 
        `
        <h1>Email Confirmation</h1>
        <div>
        <p>Welcome to Ice Cream Places! Please confirm your email by clicking on the following link</p>
        <a href=${process.env.WEB_URL}/account/confirm/${confirmationCode}> Click here</a>
        </div>
        `
    });
}

module.exports = sendConfirmationEmail;