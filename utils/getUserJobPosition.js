const getUserJobPosition = (userEmail, shopEmployees) => {
    return shopEmployees.find(e => e.email === userEmail)?.jobPosition;
}

module.exports = getUserJobPosition;