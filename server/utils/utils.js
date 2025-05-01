/* eslint-disable dot-location */
/* eslint-disable max-len */
const canadianCities = ['Toronto', 'Montreal', 'Vancouver', 
    'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec'];

// Object containing area/locality options for each city
const addresses = {
    Toronto: ['411 Castlefield Ave, Toronto, ON M5N 1L4',
        '26 Glenvale Blvd, East York, ON M4G 2V1', 
        '220 Donlea Dr, Toronto, ON M4G 2N2', 
        '250 Dawlish Ave, North York, ON M4N 1J3', 
        '358 Glencairn Ave, Toronto, ON M5N 1V1', 
        '13 Stayner Ave, North York, ON M6B 1N3'],
    Montreal: ['4359 Montrose Ave, Westmount, QC H3Y 2B2', 
        '385 35e Avenue, Lachine, QC H8T 1Z9', 
        '6922 Rue de Saint-Vallier, Montréal, QC H2S 2P9',
        '750 Av. Outremont, Outremont, QC H2V 3N3', 
        '7470 Rue de Vittel, Montréal, QC H1S 2M7'],
    Vancouver: ['2943 W 41st Ave, Vancouver, BC V6N 3C8', 
        '2832 W 36th Ave, Vancouver, BC V6N 2R1', 
        '2315 W 20th Ave, Vancouver, BC V6L 1G4', 
        '6948 Blenheim St, Vancouver, BC V6N 1R9', 
        '3119 E 54th Ave, Vancouver, BC V5S 1Y9'],
    Calgary: ['2731 17a St NW, Calgary, AB T2M 3S9', 
        '8032 5 St SW, Calgary, AB T2V 1C5', 
        '328 86 Ave SE, Calgary, AB T2H 2K5', 
        '9625 48 St SE, Calgary, AB T2C 2R1'],
    Edmonton: ['8745 151 St NW, Edmonton, AB T5R 1H8', 
        '14012 89a Ave NW, Edmonton, AB T5R 4S5', 
        '4812 21 Ave NW, Edmonton, AB T6L 2V8', 
        '1003 Huckell Pl SW, Edmonton, AB T6W 1A3'],
    Ottawa: ['3114 Kinburn Side Rd, Kinburn, ON K0A 2H0', 
        '34 Beauly St, Kanata, ON K2W 1E9', 
        '314 Badgeley Ave, Ottawa, ON K2T 0A7', 
        '21 Gray Crescent, Ottawa, ON K2K 3J5'],
    Winnipeg: ['191 Rouge Rd, Winnipeg, MB R3K 1J6', 
        '1282 Magnus Ave, Winnipeg, MB R2X 0N8', 
        '363 Oakland Ave, Winnipeg, MB R2G 0B2', 
        '356 Beliveau Rd, Winnipeg, MB R2M 1T4'],
    Quebec: ['1362 Rue des Calèches, Québec, QC G3K 2M7', 
        '3460 Rue du Joybert, Québec, QC G1P 1A7', 
        '7430 Av. Gustave Beaudet, Québec, QC G1H 6C4', 
        '875 Rue Monseigneur-Grandin, Québec City, QC G1V 3X8']
};

// Function to get a random city and area/locality pair
function getRandomAddressCityPair() {
    const randomCityIndex = Math.floor(Math.random() * canadianCities.length);
    const randomCity = canadianCities[randomCityIndex];
    const addressessInCity = addresses[randomCity];
    const randomAddress = addressessInCity[Math.floor(Math.random() * addressessInCity.length)];
    return { city: randomCity, address: randomAddress };
}


function getRandomDate() {
    // randomly get a date that starts from beginning of 2024 till current date
    const startDate = new Date('2024-01-01'); 
    const endDate = new Date(); 

    // Calculate the difference in milliseconds between the start and end date
    const difference = endDate.getTime() - startDate.getTime();

    // Generate a random number within the range of the time difference
    const randomOffset = Math.random() * difference;

    // Set the new date using the random offset
    const randomDate = new Date(startDate.getTime() + randomOffset);

    // Format the random date in YYYY-MM-DD structure
    const year = randomDate.getFullYear();
    const month = String(randomDate.getMonth() + 1).padStart(2, '0');
    const day = String(randomDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function getRandomPrice(bhk) {
    let minPrice; let maxPrice;

    // Set min and max prices based on bhk
    switch (bhk) {
    case 1:
        minPrice = 800;
        maxPrice = 1500;
        break;
    case 2:
        minPrice = 1500;
        maxPrice = 2500;
        break;
    case 3:
        minPrice = 2300;
        maxPrice = 4000;
        break;
    case 4:
        minPrice = 3200;
        maxPrice = 6000;
        break;
    default:
        return null; 
    }

    // Generate a random price within the specified range
    let randomPrice = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;

    // Ensure that the price ends with 0
    randomPrice = Math.round(randomPrice / 10) * 10;

    return randomPrice;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports = { getRandomAddressCityPair, 
    getRandomPrice, getRandomDate, shuffleArray};
