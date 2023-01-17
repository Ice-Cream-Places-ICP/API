const validator = require('validator');
const sendResponse = require('../../utils/sendResponse');
const hasDuplicates = require('../../utils/hasDuplicates');
const isAdmin = require('../../utils/isAdmin');
const areProportiesSame = require('../../utils/arePropertiesSame');
const { userStatus } = require('../../config/constants');
const User = require('../../models/User');
const mongoose = require('mongoose');

const updateUser = async (req, res) => {
    const { 
        favoriteFlavors,
        status
     } = req.body;
    const id = req?.params.id;
    let updatedUser = req.user;

    if (id) {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json(sendResponse(false, 'Invalid user id'));
        }

        if (id !== req.user.id) {
            if (!isAdmin(req.user)) {
                return res.status(400).json(sendResponse(false, 'Access denied'));
            }
            else {
                updatedUser = await User.findById(id).populate('shops.id').select('-password -createdAt -updatedAt -__v').exec();

                if (!updatedUser) {
                    return res.status(400).json(sendResponse(false, 'User not found'));
                }
            }
        }
    }

    if (favoriteFlavors?.length > 0 && hasDuplicates(favoriteFlavors)) {
        return res.status(400).json(sendResponse(false, `Flavors list cannot have duplicates`));
    }

    for (let i = 0; i < favoriteFlavors; i++) {
        if (!validator.isAlpha(favoriteFlavors[i], ['pl-PL'])) {
            return res.status(400).json(sendResponse(false, `Flavor ${favoriteFlavors[i]} contains characters that are not allowed`));
        }
    }

    if (isAdmin(req.user)) {
        const userStatusArr = Array.from(Object.values(userStatus));
        if (!userStatusArr.includes(status)) {
            return res.status(400).json(sendResponse(false, `Status '${status}' is incorrect`));
        }
        if (status) {
            updatedUser.status = status;
        }
    }
    else {
        if (!areProportiesSame(updatedUser.status, status)) {
            return res.status(400).json(sendResponse(false, 'You cannot update your own status'));
        }
    }

    updatedUser.favoriteFlavors = favoriteFlavors;
    updatedUser.updatedAt = new Date();

    await updatedUser.save();
    return res.status(200).json(sendResponse(true, 'User profile was updated', updatedUser));
}

module.exports = updateUser;