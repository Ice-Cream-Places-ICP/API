let shopDto = (shop) => {
    return {
        _id: shop._id,
        name: shop.name,
        address: shop.address,
        openingHours: shop.openingHours,
        flavors: shop.flavors,
    }
}

module.exports = shopDto;