/* eslint-disable dot-location */
const CsvReadableStream = require('csv-reader');
const fs = require('fs');
const {getRandomAddressCityPair, getRandomPrice, getRandomDate, shuffleArray} = require('./utils');

// for images, every lease gets 2 from interior and 3 from extras

async function getAllLeases(
    getImageUrls,
    readCsvFile,
    reArrangeData,
    filePath = 'data/House_Rent_Dataset.csv'
) {
    try {
        // Retrieve images' URLs from Cloudinary
        const { interior, extras } = await getImageUrls(); 

        // Read and process the CSV data
        const data = await readCsvFile(
            filePath,
            getRandomDate,
            getRandomAddressCityPair,
            getRandomPrice
        );

        // Rearrange the data and assign image URLs to each lease
        const arrangedData = reArrangeData(data, interior, extras, shuffleArray);

        return arrangedData;
    } catch (error) {
        console.error('Error in fetching data for seed:', error);
    }
}

// Rearranging function for adding images
function reArrangeData(data, interior, extras, shuffleArray) {
    // Randomize images
    shuffleArray(interior);
    shuffleArray(extras);

    let interiorIndex = 0;
    let extrasIndex = 0;

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const newImageUrls = [];

        // Add two URLs from interior
        for (let j = 0; j < 2; j++) {
            if (interiorIndex >= interior.length) {
                interiorIndex = 0;
                shuffleArray(interior);
            }
            newImageUrls.push(interior[interiorIndex]);
            interiorIndex++;
        }

        // Add two URLs from extras
        for (let j = 0; j < 2; j++) {
            if (extrasIndex >= extras.length) {
                extrasIndex = 0;
                shuffleArray(extras);
            }
            newImageUrls.push(extras[extrasIndex]);
            extrasIndex++;
        }

        // Update the image field in the item object
        item.images = newImageUrls;
    }

    return data;
}

// Reading CSV file and transforming it to objects
async function readCsvFile(
    filePath,
    getRandomDate,
    getRandomAddressCityPair,
    getRandomPrice
) {
    return new Promise((resolve, reject) => {
        const results = [];
        const inputStream = fs.createReadStream(filePath, 'utf8');
        let isFirstRow = true;

        inputStream
            .pipe(
                new CsvReadableStream({
                    parseNumbers: true,
                    parseBooleans: true,
                    trim: true,
                })
            )
            .on('data', (row) => {
                if (isFirstRow) {
                    isFirstRow = false;
                } else {
                    const randomPostedDate = getRandomDate();
                    const randomAddressCityPair = getRandomAddressCityPair();
                    const randomPrice = getRandomPrice(row[1]);
                    const customizedObject = {
                        postedDate: randomPostedDate,
                        bhk: row[1],
                        rentPrice: randomPrice,
                        size: row[3],
                        floor: row[4],
                        address: randomAddressCityPair.address,
                        city: randomAddressCityPair.city,
                        furnishing: row[8],
                        preferredTentant: row[9],
                        bathroom: row[10],
                        pointOfContact: row[11],
                        description: null,
                        images: null,
                        reports: 0,
                    };
                    results.push(customizedObject);
                }
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

module.exports = { getAllLeases, shuffleArray, reArrangeData, readCsvFile };
