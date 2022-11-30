const sendResponse = require('../../utils/sendResponse.js');
const Shop = require('../../models/Shop');

const getAllShops = async (req, res) => {
    let shops = await Shop.find({ removedAt: '' }).exec();

    if (!shops?.length) {
        return res.status(200).json(sendResponse(true, 'No shops found'));
    }

    res.status(200).json(sendResponse(true, 'Shops retrieved', shops));
}

module.exports = getAllShops;
