const roles = {
    ADMIN: 'admin', 
    DEFAULT: 'default', 
    OWNER: 'owner',
    EMPLOYEE: 'employee'
}

const allowedOrigins = [
    `http://localhost:${process.env.WEB_PORT}`
]

module.exports = { 
    roles,
    allowedOrigins
};