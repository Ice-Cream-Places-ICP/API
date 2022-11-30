const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const sendResponse = require('../../utils/sendResponse.js');

const userRegister = async (req, res) => {
	try {
		let req_email = req.body.email;
		let req_password = req.body.password;
		let req_roles = req.body.roles;

		if (!req_roles) {
			req_roles = ['default'];
		} 

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

		const newUser = new User({
			email: req_email,
			password: req_password,
			roles: req_roles,
		});

		await newUser.save();

		res.status(200).json(sendResponse(true, 'New user created'));
	} catch (e) {
		res.json(sendResponse(false, e));
	}
};

const userLogin = async (req, res) => {
	try {
		let req_email = req.body.email;
		let req_password = req.body.password;

		if (!req_email || !req_password) {
			return res.status(400).json(sendResponse(false, 'All fields are required'));
		}

		const user = await User.findOne({ email: req_email });

		if (!user || !(await bcrypt.compare(req_password, user.password))) {
			return res.status(400).json(sendResponse(false, 'Invalid credentials'));
		}

		const token = await jwt.sign(
			user._id.toString(),
			process.env.TOKEN_SECRET
		);

		res.header('token', token);
		res.status(200).json(sendResponse(true, 'Login Successfully'));
	} catch (e) {
		res.json(sendResponse(false, e));
	}
};

module.exports = { userRegister, userLogin };
