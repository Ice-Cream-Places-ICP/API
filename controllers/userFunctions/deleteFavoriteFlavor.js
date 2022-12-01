const sendResponse = require('../../utils/sendResponse');

const deleteFavoriteFlavor = async (req, res) => {
    const { flavorName } = req.params;
    const userFavoriteFlavors = req.user.favoriteFlavors;

    if (!userFavoriteFlavors.includes(flavorName)) {
        return res.status(400).json(sendResponse(false, `There is no flavor with name '${flavorName}' in user favorites`))
    }

    const flavorPosition = userFavoriteFlavors.find(f => f === flavorName);
    userFavoriteFlavors.splice(flavorPosition, 1);
    req.user.favoriteFlavors = userFavoriteFlavors;
    
    await req.user.save();
    return res.status(200).json(sendResponse(true, `Flavor '${flavorName}' was succesfully removed from user favorites`));
}

module.exports = deleteFavoriteFlavor;