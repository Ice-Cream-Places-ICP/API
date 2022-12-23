const User = require('../../models/User');
const sendResponse = require('../../utils/sendResponse');

const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password -__v').exec(); 
    
    if (!users?.length) {
        return res.status(200).json(sendResponse(true, 'No users found'));
    }

    res.status(200).json(sendResponse(true, 'Users retrieved', users));
}

module.exports = getAllUsers;