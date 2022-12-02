const validator = require('validator');
const sendResponse = require('../../utils/sendResponse');
const hasDuplicates = require('../../utils/hasDuplicates');
const isAdmin = require('../../utils/isAdmin');
const User = require('../../models/User');
const mongoose = require('mongoose');

const updateUser = async (req, res) => {
    const { favoriteFlavors } = req.body;
    const _id = req?.params.id;
    let user = req.user;

    if (_id) {
        if (!mongoose.isValidObjectId(_id)) {
            return res.status(400).json(sendResponse(false, 'Invalid user id'));
        }

        if (_id !== user._id.toString()) {
            if (!isAdmin(user)) {
                return res.status(400).json(sendResponse(false, 'Access denied'));
            }
            else {
                user = await User.findById(_id).populate('shops.id').select('-password -createdAt -updatedAt -__v').exec();
            }
        }
    }

    if (hasDuplicates(favoriteFlavors)) {
        return res.status(400).json(sendResponse(false, `Flavors list cannot have duplicates`));
    }

    for (let i = 0; i < favoriteFlavors; i++) {
        if (!validator.isAlpha(favoriteFlavors[i], ['pl-PL'])) {
            return res.status(400).json(sendResponse(false, `Flavor ${favoriteFlavors[i]} contains characters that are not allowed`));
        }
    }

    req.user.favoriteFlavors = favoriteFlavors;
    req.user.updatedAt = new Date();

    await req.user.save();
    return res.status(200).json(sendResponse(true, 'User profile was updated', req.user));
}

module.exports = updateUser;