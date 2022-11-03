const { formatOpeningHours } = require('../utils/formatOpeningHours');

let shopDto = (shop) => {
    return {
        _id: shop._id,
        name: shop.name,
        address: shop.address,
        openingHours: shop.openingHours.map(oh => formatOpeningHours(oh)),
        flavors: shop.flavors,
    }
}

module.exports = shopDto;