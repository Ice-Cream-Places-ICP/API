let shopDto = (shop) => {
    return {
        _id: shop._id,
        name: shop.name,
        address: shop.address,
        flavors: shop.flavors,
    }
}

module.exports = shopDto;