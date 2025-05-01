const fs = require('fs');
const azureConnection = process.env.AZURE_CONNECTION;
const azureContainerName = process.env.AZURE_CONTAINER_NAME;
const { BlobServiceClient} = require('@azure/storage-blob');


async function getImageUrls(getContainerClient, uploadService,
    interiorFolderPath = 'data/images/interior', extrasFolderPath = 'data/images/extras') {
    const containerClient = getContainerClient();

    const interiorUrls = [];
    const extrasUrls = []; 
    let completed = 0;
    
    return new Promise((resolve, reject) => {
        function checkCompletion() {
            completed++;
            if (completed === 2) {
                resolve({ interior: interiorUrls, extras: extrasUrls });
            }
        }

        fs.readdir(interiorFolderPath, async (err, files) => {
            if (err) {
                console.error('Error reading folder:', err);
                reject(err);
                return;
            }

            const uploadPromises = [];

            for (const file of files) {
                // Skip .DS_Store files
                if (file === '.DS_Store') {
                    continue;
                }

                const filePath = `${interiorFolderPath}/${file}`;


                // Wrap the asynchronous operation inside a function and push it to uploadPromises
                const uploadPromise = (async () => {
                    const url = await uploadService(filePath, containerClient, file);
                    interiorUrls.push(url);
                })();

                uploadPromises.push(uploadPromise);
            }
            await Promise.all(uploadPromises);
            checkCompletion();
        });

        fs.readdir(extrasFolderPath, async (err, files) => {
            if (err) {
                console.error('Error reading extras folder:', err);
                reject(err);
                return;
            }

            const uploadPromises = [];

            for (const file of files) {
                if (file === '.DS_Store') {
                    continue;
                }

                const filePath = `${extrasFolderPath}/${file}`;

                const uploadPromise = (async () => {
                    const url = await uploadService(filePath, containerClient, file);
                    extrasUrls.push(url);
                })();

                uploadPromises.push(uploadPromise);
            }
            await Promise.all(uploadPromises);
            checkCompletion();
        });

    });
}

function getContainerClient(){
    const blobService = BlobServiceClient.fromConnectionString(azureConnection);
    return blobService.getContainerClient(azureContainerName);
}

async function uploadService(filePath, containerClient, file){
    try {
        const blobClient = containerClient.getBlockBlobClient(file);
        const fileData = fs.readFileSync(filePath);
        const options = { blobHTTPHeaders: { blobContentType: 'image/webp' } };
        await blobClient.uploadData(fileData, options);
        return blobClient.url;
    } catch (error) {
        console.error('Error uploading file (extras):', error.message);
    }
}
module.exports = {getImageUrls, getContainerClient, uploadService};
