const express = require('express');
const resendConfirmationMail = require('../controllers/mailFunctions/resendConfirmationMail.js');

const router = express.Router();

router.post('/resend-confirmation', resendConfirmationMail);

module.exports = router;