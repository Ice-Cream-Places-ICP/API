const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const sendResponse = require('../../utils/sendResponse.js');
const sendConfirmationEmail = require('../../utils/sendConfirmationEmail');
const { roles, userStatus, authMethod } = require('../../config/constants');

const userRegister = async (req, res) => {
	let req_email = req.body.email;
	let req_password = req.body.password;

	if (!req_email || !req_password) {
		return res.status(400).json(sendResponse(false, 'All fields are required'));
	}

	if (!validator.isEmail(req_email)) {
		return res.status(400).json(sendResponse(false, 'Invalid email'));
	}

	if (!validator.isStrongPassword(req_password)) {
		return res.status(400).json(sendResponse(false, 'Password must contain minimum 8 letters containing at least - 1 lowercase, 1 uppercase, 1 number, 1 symbol'));
	}

	if (await User.findOne({ email: req_email })) {
		return res.status(400).json(sendResponse(false, 'User already exists'));
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req_password, salt);

	const token = jwt.sign({ email: req_email }, process.env.TOKEN_SECRET);

	const newUser = new User({
		email: req_email,
		password: hashedPassword,
		roles: [roles.DEFAULT],
		confirmationCode: token,
		authType: authMethod.EMAIL
	});

	await newUser.save();
	sendConfirmationEmail(newUser.email, newUser.confirmationCode);

	res.status(200).json(sendResponse(true, 'New user created'));
};

const userLogin = async (req, res) => {
	let req_email = req.body.email;
	let req_password = req.body.password;

	if (!req_email || !req_password) {
		return res.status(400).json(sendResponse(false, 'All fields are required'));
	}

	const user = await User.findOne({ email: req_email });

	if (!user || !(await bcrypt.compare(req_password, user?.password))) {
		return res.status(400).json(sendResponse(false, 'Invalid credentials'));
	}

	if (user?.authType !== authMethod.EMAIL) {
		return res.status(400).json(sendResponse(false, "This account can't be signed in with email"));
	}

	if (user?.status !== userStatus.ACTIVE) {
		return res.status(400).json(sendResponse(false, 'Verify your email before logging in'));
	}

	const token = await jwt.sign(
		user._id.toString(),
		process.env.TOKEN_SECRET
	);

	res.status(200).json(sendResponse(true, 'Login Successfully', { token: token }));
};

const userVerify = async (req, res) => {
	const confirmationCode = req.params.confirmationCode;
	if (!confirmationCode) {
		return res.status(400).json(sendResponse(false, 'Confirmation code required'));
	}

	const user = await User.findOne({ confirmationCode: confirmationCode }).exec();
	if (!user) {
		return res.status(400).json(sendResponse(false, 'Invalid confirmation code'));
	}

	if (user.status === userStatus.ACTIVE) {
		return res.status(400).json(sendResponse(false, 'User email was already verified'));
	}

	user.status = userStatus.ACTIVE;
	await user.save();

	res.status(200).json(sendResponse(true, 'Email verified'));
}

const passportLogin = (req, res) => {
	const token = jwt.sign(
		req?.user?.id.toString(),
		process.env.TOKEN_SECRET
	);

	res.redirect(`${process.env.WEB_URL}/login/success/${token}`);
}

module.exports = { userRegister, userLogin, userVerify, passportLogin };
