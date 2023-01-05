require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');

const corsOptions = require("./config/corsOptions");
const authRouts = require("./routes/authRoutes");
const shopRoutes = require("./routes/shopRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const mailRoutes = require('./routes/mailRoutes');
const app = express();

//MIDDLEWARE
app.use(requestLogger);
app.use(cookieSession({
    maxAge: 5 * 60 * 60 * 1000,
    keys: [process.env.TOKEN_SECRET]
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors(corsOptions));
app.use("/auth", authRouts);
app.use("/shops", shopRoutes);
app.use("/users", userRoutes);
app.use("/mail", mailRoutes);
app.use(errorHandler);

module.exports = app;
