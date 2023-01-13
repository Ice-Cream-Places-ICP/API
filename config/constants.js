const roles = {
  ADMIN: "admin",
  DEFAULT: "default",
  OWNER: "owner",
  EMPLOYEE: "employee",
};

const userStatus = {
  PENDING: "pending",
  ACTIVE: "active",
};

const allowedOrigins = [
  `http://localhost:${process.env.WEB_PORT}`,
  "https://ice-cream-places-web.vercel.app",
];

const authMethod = {
  EMAIL: 'email', 
  GOOGLE: 'google',
  FACEBOOK: 'facebook'
}

const notificationType = {
  SHOP_INVITATION: 'shopInvitation',
  SHOP_UPDATE: 'shopUpdate'
}

const employeeStatus = {
  ACTIVE: 'active',
  PENDING: 'pending',
  REJECT: 'reject'
}

module.exports = {
  roles,
  allowedOrigins,
  userStatus,
  authMethod,
  notificationType,
  employeeStatus,
};
