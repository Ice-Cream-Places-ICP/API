const User = require("../../models/User");
const validator = require('validator');
const { userStatus, authMethod } = require('../../config/constants')
const sendResponse = require('../../utils/sendResponse');
const sendConfirmationEmail = require('../../utils/sendConfirmationEmail');

const resendConfirmationMail = async (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json(sendResponse(false, 'Email address was not specified'));
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json(sendResponse(false, 'Invalid email'));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json(sendResponse(false, `Account with email address '${email}' does not exist`));
    }

    if (user.status !== userStatus.PENDING) {
        return res.status(400).json(sendResponse(false, `Account with email address '${email}' was already verified`));
    }

    if (user?.authType !== authMethod.EMAIL) {
        return res.status(400).json(sendResponse(false, `Account with email address '${email}' uses other authentication method than email`));
    }

    sendConfirmationEmail(email, user.confirmationCode);
    res.status(200).json(sendResponse(true, `Verification email to address '${email}' was sent`))
}

module.exports = resendConfirmationMail;