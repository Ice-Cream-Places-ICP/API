const User = require('../../models/userModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const sendResponse = require('../../utils/sendResponse.js');
const orderComment = require('../../utils/orderComment.js');

const userRegister = async (req, res) => {
	orderComment('register');

	try {
		let req_email = req.body.email;
		let req_password = req.body.password;
		let req_type = req.body.type === '' ? 'default' : req.body.type;

		if (!req_email || !req_password) {
			return res.status(400).json(sendResponse(false, 'All fields are required'));
		}

		if (!validator.isEmail(req_email)) {
			return res.status(400).json(sendResponse(false, 'Invalid email'));
		}

		if (!validator.isStrongPassword(req_password))
		{
			return res.status(400).json(sendResponse(false, 'Password must contain minimum 8 letters containing at least - 1 lowercase, 1 uppercase, 1 number, 1 symbol'));
		}

		if (await User.findOne({ email: req_email })) {
			return res.status(400).json(sendResponse(false, 'User already exists'));
		}

		const newUser = new User({
			email: req_email,
			password: req_password,
			type: req_type,
		});

		await newUser.save();

		console.log('New user created');
		console.log(newUser);
		res.status(200).json(sendResponse(true, 'New user created'));
	} catch (e) {
		console.log(e);
		res.json(sendResponse(false, e));
	}
};

const userLogin = async (req, res) => {
	console.log('----------------------------------------------');
	console.log('LOGIN ORDER');

	try {
		let req_email = req.body.email;
		let req_password = req.body.password;

		const user = await User.findOne({ email: req_email });

		if (!user) {
			throw "This user doesn't exist";
		}

		if (!(await bcrypt.compare(req_password, user.password))) {
			throw 'Wrong password';
		}

		const token = await jwt.sign(user._id.toString(), process.env.TOKEN_SECRET);

		console.log('Login Successfully');
		res.header('token', token);
		res.status(200).json(sendResponse(true, 'Login Successfully'));
	} catch (e) {
		res.json(sendResponse(false, e));
	}
};

module.exports = { userRegister, userLogin };
