const mongoose = require('mongoose');

const flavorsArray = new mongoose.Schema({
	type: [
		{
			type: String,
		},
	],
});
