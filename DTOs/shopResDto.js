const { mapOpeningHoursToRes } = require('../utils/formatOpeningHours');

let shopResDto = (shop) => {
    return {
        _id: shop._id,
        name: shop.name,
        address: shop.address,
        openingHours: shop.openingHours.map(oh => mapOpeningHoursToRes(oh)),
        flavors: shop.flavors,
    }
}

module.exports = shopResDto;