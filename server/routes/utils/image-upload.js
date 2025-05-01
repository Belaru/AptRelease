const azureConnection = process.env.AZURE_CONNECTION;
const azureContainerName = process.env.AZURE_CONTAINER_NAME;
const { BlobServiceClient} = require('@azure/storage-blob');

async function getImageUrls(files){
    if (!files || Object.keys(files).length === 0) {
        return [];
    }

    const blobService = BlobServiceClient.fromConnectionString(azureConnection);
    const containerClient = blobService.getContainerClient(azureContainerName);

    const uploadPromises = [];
    // store file names in blobclient and retrieve urls
    for (const [, file] of Object.entries(files)) {
        if (file) {
            const blobClient = containerClient.getBlockBlobClient(file.name);
            const options = { blobHTTPHeaders: { blobContentType: file.mimetype } };
            const uploadPromise = blobClient.uploadData(file.data, options);
            uploadPromises.push(uploadPromise);
        }
    }
    // for avoiding await in loop
    await Promise.all(uploadPromises);

    const imageUrls = Object.values(files).filter(file => file).map(file => {
        const blobClient = containerClient.getBlockBlobClient(file.name);
        return blobClient.url;
    });

    return imageUrls;
}

module.exports = {getImageUrls};