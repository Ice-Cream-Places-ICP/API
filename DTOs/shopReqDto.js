const { mapOpeningHoursToDb } = require('../utils/formatOpeningHours');

let shopReqDto = (shop) => {
    console.log('here')
    return {
        name: shop.name,
        address: shop.address,
        openingHours: shop?.openingHours.map(oh => mapOpeningHoursToDb(oh)),
        flavors: shop?.flavors,
    }
}

module.exports = shopReqDto;