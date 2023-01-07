const express = require('express');
const {
	userRegister,
	userLogin,
	userVerify,
	passportLogin,
} = require('../controllers/authFunctions/authFunctions.js');
const loginErrorRedirect = require('../middleware/loginErrorRedirect');
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
	loginErrorRedirect,
	passportLogin
);
router.get('/facebook',
	passport.authenticate('facebook', {
		scope: [
			'public_profile',
			'email'
		]
	})
);
router.get('/facebook/redirect',
	passport.authenticate('facebook'),
	loginErrorRedirect,
	passportLogin
);

module.exports = router;
