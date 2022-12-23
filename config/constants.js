const roles = {
    ADMIN: 'admin', 
    DEFAULT: 'default', 
    OWNER: 'owner',
    EMPLOYEE: 'employee'
}

const userStatus = {
    PENDING: 'pending',
    ACTIVE: 'active',
}

const allowedOrigins = [
    `http://localhost:${process.env.WEB_PORT}`
]

module.exports = { 
    roles,
    allowedOrigins,
    userStatus
};