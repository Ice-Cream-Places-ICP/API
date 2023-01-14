const { transport } = require('../config/mailerConfig');

const sendPasswordResetEmail = (email, passwordResetCode) => {
    transport.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Password reset - Ice Cream Places",
        html: 
        `
        <h1>Password reset</h1>
        <div>
        <p>Use link below to reset your password</p>
        <a href=${process.env.WEB_URL}/auth/reset-password/${passwordResetCode}> Click here</a>
        </div>
        `
    });
}

module.exports = sendPasswordResetEmail;