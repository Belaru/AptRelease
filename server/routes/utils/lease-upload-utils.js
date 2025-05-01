function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    // Month is zero-based, so add 1 to get the current month
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


// Validation function
function validateProperty(property) {
    const { rentPrice, address, 
        contactInfo, size, 
        bedrooms, bathrooms, floorNumber, furnishing } = property;
    // Check if all required fields are present and non-empty
    if (!rentPrice || !address 
        || !contactInfo 
        || !size || !bedrooms || !bathrooms || !floorNumber || !furnishing) {
        return false;
    }
    // Check if rentPrice, size, bedrooms, bathrooms, and floorNumber are numbers
    if (isNaN(rentPrice) || isNaN(size) 
    || isNaN(bedrooms) || isNaN(bathrooms) || isNaN(floorNumber)) {
        return false;
    }
    return true;
}

module.exports = { getCurrentDate, validateProperty};