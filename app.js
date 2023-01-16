require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const passportSetup = require("./config/passport-setup");
const corsOptions = require("./config/corsOptions");
const authRouts = require("./routes/authRoutes");
const shopRoutes = require("./routes/shopRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const mailRoutes = require("./routes/mailRoutes");
const app = express();

//MIDDLEWARE
app.use(requestLogger);
app.use(express.json());
app.use(cors(corsOptions));
app.use("/auth", authRouts);
app.use("/shops", shopRoutes);
app.use("/users", userRoutes);
app.use("/mail", mailRoutes);
app.use(errorHandler);

// test for CI

module.exports = app;
