const hasDuplicates = (array) => {
    array = array.map(element => JSON.stringify(element));
    return (new Set(array)).size !== array.length;
}

module.exports = hasDuplicates;