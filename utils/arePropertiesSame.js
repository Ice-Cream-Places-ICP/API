const arePropertiesSame = (property, other) => {
    return JSON.stringify(property) === JSON.stringify(other) ? true : false;
}

module.exports = arePropertiesSame;