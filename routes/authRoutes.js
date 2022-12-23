const express = require('express');
const {
	userRegister,
	userLogin,
	userVerify,
} = require('../controllers/authFunctions/authFunctions.js');

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/confirm/:confirmationCode', userVerify)

module.exports = router;
