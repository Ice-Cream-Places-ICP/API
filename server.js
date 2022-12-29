const { app } = require('./index.js');

//SERVER LISTENING
app.listen(process.env.PORT, () => {
	console.log(`Server up at port ${process.env.PORT}`);
});
