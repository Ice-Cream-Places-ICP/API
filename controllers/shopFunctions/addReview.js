const mongoose = require('mongoose');
const Shop = require('../../models/Shop');
const sendResponse = require('../../utils/sendResponse');

const addReview = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.isValidObjectId(_id)) {
        return res.status(400).json(sendResponse(false, 'Invalid shop id'));
    }

    let shop = await Shop.findOne({ _id, removedAt: '' }).exec();

    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop not found'));
    }

    const {
        rate,
        content
    } = req.body;

    if (shop.employees.find(e => e.email === req.user.email)) {
        return res.status(400).json(sendResponse(false, 'You cannot review shop that you\'re associated with'));
    }

    if (shop.reviews.find(r => r.user.toString() === req.user._id.toString())) {
        return res.status(400).json(sendResponse(false, 'You cannot review shop more than once'));
    }

    if (!rate || !content) {
        return res.status(400).json(sendResponse(false, 'Review object must have all fields specified'));
    }

    const review = {
        user: req.user._id,
        rate: rate,
        content: content
    }

    shop.reviews.push(review);
    const createdShop = await shop.save();
    const cretedReview = createdShop.reviews.find(r => r.user.toString() === review.user.toString())

    return res.status(200).json(sendResponse(true, 'Review added', cretedReview));
}

module.exports = addReview;