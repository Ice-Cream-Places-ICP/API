const { app } = require('./index.js');
const mongoose = require('mongoose');

// DATABASE CONNECTION
mongoose.connect(process.env.DB_CONNECTION, () => {
	console.log('Database Connected');
});

//SERVER LISTENING
app.listen(process.env.PORT, () => {
	console.log(`Server up at port ${process.env.PORT}`);
});
