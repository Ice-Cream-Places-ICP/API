const { employeeStatus } = require("../config/constants");

const getUserJobPosition = (userEmail, shopEmployees) => {
    return shopEmployees.find(e => e.email === userEmail && employeeStatus.ACTIVE)?.jobPosition;
}

module.exports = getUserJobPosition;