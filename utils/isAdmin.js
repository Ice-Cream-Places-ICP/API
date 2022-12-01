const { roles } = require('../config/constants');

const isAdmin = (user) => {
    return user?.roles.includes(roles.ADMIN) ? true : false;
}

module.exports = isAdmin;