const express = require('express');
const {
	userRegister,
	userLogin,
	userVerify,
	passportLogin,
} = require('../controllers/authFunctions/authFunctions.js');
const passport = require('passport');

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/confirm/:confirmationCode', userVerify)
router.get('/google',
	passport.authenticate('google', {
		scope: [
			'email',
			'profile'
		]
	})
);
router.get('/google/redirect',
	passport.authenticate('google'),
	passportLogin
);

module.exports = router;
