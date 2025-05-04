const fs = require('fs');
const path = require('path');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    'cloud_name':process.env.CLOUDINARY_CLOUD_NAME,
    'api_key':process.env.CLOUDINARY_API_KEY,
    'api_secret':process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Upload the image to Cloudinary
async function uploadService(filePath, folder) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resourceType: 'image/webp',
        });
        return result.secure_url;
    } catch (error) {
        console.error(`❌ Error uploading "${filePath}":`, error.message);
        return null;
    }
}

// Get image URLs from the given folders and upload them to Cloudinary
async function getImageUrls(interiorFolderPath = 'data/images/interior', 
    extrasFolderPath = 'data/images/extras') {
    const interiorUrls = [];
    const extrasUrls = [];

    async function processFolder(folderPath, folderName, urlList) {
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            if (file === '.DS_Store') continue;
            const filePath = path.join(folderPath, file);
            const url = await uploadService(filePath, folderName);
            if (url) urlList.push(url);
        }
    }

    // Upload images from both the interior and extras folders
    await Promise.all([
        processFolder(interiorFolderPath, 'interior', interiorUrls),
        processFolder(extrasFolderPath, 'extras', extrasUrls),
    ]);

    return { interior: interiorUrls, extras: extrasUrls };
}

module.exports = { getImageUrls };
