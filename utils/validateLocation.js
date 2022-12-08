const validateLocation = (longtitude, latitude) => {
    if (longtitude < -180 || longtitude > 180) {
        return false;
    }
    if (latitude < -90 || latitude > 90) {
        return false;
    }
    return true;
}

module.exports = validateLocation;