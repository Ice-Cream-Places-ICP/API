const router = require('express').Router();
const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendResponse = require('../utils/sendResponse.js');

router.post('/register', async (req, res) => {
	console.log('----------------------------------------------');
	console.log('REGISTER ORDER');

	try {
		let req_email = req.body.email;
		let req_password = req.body.password;
		let req_type = req.body.type === '' ? 'default' : req.body.type;

		if (await User.findOne({ email: req_email })) {
			throw 'This user already exist';
		}

		const newUser = new User({
			email: req_email,
			password: req_password,
			type: req_type,
		});

		await newUser.save();

		console.log('New user created');
		console.log(newUser);
		res.json('New user created');
	} catch (e) {
		console.log(e);
		res.json(sendResponse(false, e));
	}
});

router.post('/login', async (req, res) => {
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
});

module.exports = router;
