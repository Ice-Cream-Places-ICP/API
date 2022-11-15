require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRouts = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes.js');
const cors = require('cors');
const app = express();

//MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use('/auth', authRouts);
app.use('/shop', shopRoutes);

//sample get endpoint
app.get('/sample', (req, res) => {
	res.send('I am from API');
});

//DATABASE CONNECTION
mongoose.connect(process.env.DB_CONNECTION, () => {
	console.log('Database Connected');
});

//SERVER LISTENING
app.listen(process.env.PORT, () => {
	console.log(`Server up at port ${process.env.PORT}`);
});
