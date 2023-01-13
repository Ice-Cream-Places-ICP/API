const { roles } = require('../config/constants');

const isEmployeeType = (type) => {
    if ([roles.OWNER, roles.EMPLOYEE].includes(type)) {
        return true;
    }
    return false;
}

module.exports = isEmployeeType;