const openingHoursOverflow = (openingHours) => {
    const set = new Set();
    openingHours.forEach(o => {
        set.add(o.weekDay);
    });
    
    if (set.size === openingHours.length && 
        openingHours.length <= 7) {
        return false;
    }
    return true;
}

module.exports = openingHoursOverflow;