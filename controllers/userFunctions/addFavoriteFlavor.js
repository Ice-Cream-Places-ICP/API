const validator = require('validator');
const sendResponse = require('../../utils/sendResponse');

const addFavoriteFlavor = async (req, res) => {
    const { flavor } = req.body;
    const userFavoriteFlavors = req.user.favoriteFlavors;

    if (userFavoriteFlavors.includes(flavor)) {
        return res.status(400).json(sendResponse(false, `Flavor '${flavor}' was already added to user favorites`));
    }

    if (!validator.isAlpha(flavor, ['pl-PL'])) {
        return res.status(400).json(sendResponse(false, 'Flavor name contains characters that are not allowed'));
    }

    userFavoriteFlavors.push(flavor);
    req.user.favoriteFlavors = userFavoriteFlavors;
    
    await req.user.save();
    return res.status(200).json(sendResponse(true, 'New flavor was added to user favorites', userFavoriteFlavors));
}

module.exports = addFavoriteFlavor;