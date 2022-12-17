const Shop = require('../../models/Shop');
const mongoose = require('mongoose');
const isAdmin = require('../../utils/isAdmin');
const sendResponse = require('../../utils/sendResponse');

const updateReview = async (req, res) => {
    const shopId = req.params.shopId;
    const reviewId = req.params.reviewId;
    const {
        rate,
        content
    } = req.body;

    if (!mongoose.isValidObjectId(shopId)) {
        return res.status(400).json(sendResponse(false, 'Invalid shop id'));
    }
    if (!mongoose.isValidObjectId(reviewId)) {
        return res.status(400).json(sendResponse(false, 'Invalid review id'));
    }

    const shop = await Shop.findOne({ _id: shopId, removedAt: '' }).exec();

    if (!shop) {
        return res.status(400).json(sendResponse(false, 'Shop does not exist'));
    }

    if (!shop.reviews.find(r => r._id.toString() === reviewId)) { 
        return res.status(400).json(sendResponse(false, 'Review does not exist'));
    }
    
    if (!isAdmin(req.user) && 
        !shop.reviews.find(r => r.user.toString() === req.user._id.toString())) 
    {
        return res.status(400).json(sendResponse(false, 'You cannot modify other reviews than your own'));
    }

    const review = shop.reviews.find(r => r._id.toString() === reviewId)
    review.rate = rate;
    review.content = content;

    const createdShop = await shop.save();
    const cretedReview = createdShop.reviews.find(r => r.user.toString() === review.user.toString())

    return res.status(200).json(sendResponse(true, 'Review updated', cretedReview));
} 

module.exports = updateReview;