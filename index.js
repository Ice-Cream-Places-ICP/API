require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const authRouts = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const app = express();

//MIDDLEWARE
app.use(requestLogger);
app.use(express.json());
app.use(cors());
app.use('/auth', authRouts);
app.use('/shops', shopRoutes);
app.use('/users', userRoutes);
app.use(errorHandler);

module.exports = { app };