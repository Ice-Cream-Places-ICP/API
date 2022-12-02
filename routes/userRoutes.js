const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const getUserInfo = require('../middleware/getUserInfo');
const getUser = require('../controllers/userFunctions/getUser');
const updateUser = require('../controllers/userFunctions/updateUser');

router.use(verifyToken);
router.use(getUserInfo);

router.get(
    '/:id?',
    getUser
)

router.patch(
    '/:id?', 
    updateUser
)

module.exports = router;