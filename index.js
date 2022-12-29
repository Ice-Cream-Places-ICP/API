require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const corsOptions = require('./config/corsOptions');
const authRouts = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const app = express();

//MIDDLEWARE
app.use(requestLogger);
app.use(express.json());
app.use(cors(corsOptions));
app.use('/auth', authRouts);
app.use('/shops', shopRoutes);
app.use('/users', userRoutes);
app.use(errorHandler);

app.get('/sample', (req, res) => {
	res.send('Hello world');
});

module.exports = { app };