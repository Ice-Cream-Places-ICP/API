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
	passport.authenticate('google', {
		successRedirect: process.env.WEB_URL + '/google/success',
		failureRedirect: '/google/failure',
	})
);
router.get('/google/success', passportLogin);
router.get('/google/failure', passportLogin);

module.exports = router;
