const User = require('../models/userModel');

const isOwnerOrAdmin = async userId => {
	const user = await User.findById(userId);
	if (user.type === 'owner' || user.type === 'admin') {
		return true;
	} else {
		return false;
	}
};

module.exports = isOwnerOrAdmin;
