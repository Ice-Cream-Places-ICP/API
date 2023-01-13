const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const getUserInfo = require('../middleware/getUserInfo');
const getUser = require('../controllers/userFunctions/getUser');
const updateUser = require('../controllers/userFunctions/updateUser');
const getAllUsers = require('../controllers/userFunctions/getAllUsers');
const verifyRoles = require('../middleware/verifyRoles');
const acceptInvitation = require('../controllers/userFunctions/acceptInvitation');
const declineInvitation = require('../controllers/userFunctions/declineInvitation');
const { roles } = require('../config/constants');

router.use(verifyToken);
router.use(getUserInfo);

router.get(
    '/all',
    verifyRoles(roles.ADMIN),
    getAllUsers
)

router.get(
    '/:id?',
    getUser
)

router.patch(
    '/:id?', 
    updateUser
)

router.post(
    '/shop-invitations/:id/accept',
    verifyRoles(roles.DEFAULT),
    acceptInvitation
)

router.post(
    '/shop-invitations/:id/decline',
    verifyRoles(roles.DEFAULT),
    declineInvitation
)

module.exports = router;