const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendResponse = require('../../utils/sendResponse');
const sendPasswordResetEmail = require('../../utils/sendPasswordResetEmail');

const requestPasswordReset = async (req, res) => {
    const {
        email
    } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json(sendResponse(false, 'User not found'));
    }

    const passwordResetCode = jwt.sign({ email }, process.env.TOKEN_SECRET);
    user.passwordResetCode = passwordResetCode;

    await user.save();
    sendPasswordResetEmail(email, passwordResetCode);

    res.status(200).json(sendResponse(false, 'Email with link to reset password sent'));
}

const resetPassword = async (req, res) => {
    const passwordResetCode = req.params.code;
    const {
        password
    } = req.body;

    const user = await User.findOne({ passwordResetCode }).exec();
    if (!user) { 
        return res.status(400).json(sendResponse(false, 'Invalid code'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.passwordResetCode = undefined;

    await user.save();

    res.status(200).json(sendResponse(true, 'Password has been reset successfully'));
}

module.exports = {
    requestPasswordReset,
    resetPassword
};