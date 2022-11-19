require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const authRouts = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes.js');
const app = express();

//MIDDLEWARE
app.use(requestLogger);
app.use(express.json());
app.use(cors());
app.use('/auth', authRouts);
app.use('/shop', shopRoutes);
app.use(errorHandler);

//sample get endpoint
app.get('/sample', (req, res) => {
	res.send('I am from API');
});

module.exports = { app };