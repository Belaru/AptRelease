const { getCurrentDate, validateProperty } = require('../routes/utils/lease-upload-utils');
const { getImageUrls } = require('../routes/utils/image-upload');
const { BlobServiceClient } = require('@azure/storage-blob');

describe('getCurrentDate', () => {
    test('should return current date in yyyy-mm-dd format', () => {
        const currentDate = new Date();
        const expectedDate = 
            `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).
                padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        expect(getCurrentDate()).toEqual(expectedDate);
    });
});

describe('validateProperty', () => {
    test('should return true for valid property', () => {
        const property = {
            rentPrice: 1000,
            address: '123 Main St',
            contactInfo: '123-456-7890',
            size: 1000,
            bedrooms: 3,
            bathrooms: 2,
            floorNumber: 2,
            furnishing: 'Furnished'
        };
        expect(validateProperty(property)).toBe(true);
    });

    test('should return false if any required field is missing', () => {
        const property = {
            rentPrice: 1000,
            // Missing address
            contactInfo: '123-456-7890',
            size: 1000,
            bedrooms: 3,
            bathrooms: 2,
            floorNumber: 2,
            furnishing: 'Furnished'
        };
        expect(validateProperty(property)).toBe(false);
    });

    test('should return false if any required field is empty', () => {
        const property = {
            rentPrice: 1000,
            address: '', 
            contactInfo: '123-456-7890',
            size: 1000,
            bedrooms: 3,
            bathrooms: 2,
            floorNumber: 2,
            furnishing: 'Furnished'
        };
        expect(validateProperty(property)).toBe(false);
    });

    test('should return false if any numeric field is not a number', () => {
        const property = {
            rentPrice: '1000', 
            address: '123 Main St',
            contactInfo: '123-456-7890',
            size: 1000,
            bedrooms: 3,
            bathrooms: 2,
            floorNumber: 'sss',
            furnishing: 'Furnished'
        };
        expect(validateProperty(property)).toBe(false);
    });
});

// Mock environment variables
process.env.AZURE_CONNECTION = 'mock_connection_string';
process.env.AZURE_CONTAINER_NAME = 'mock_container_name';

// Mock Azure BlobServiceClient methods
jest.mock('@azure/storage-blob', () => ({
    BlobServiceClient: {
        fromConnectionString: jest.fn(),
    },
}));

describe('getImageUrls', () => {
    test('should return empty array if no files are provided', async () => {
        const files = {};
        const imageUrls = await getImageUrls(files);
        expect(imageUrls).toEqual([]);
    });

    test('should return array of image URLs', async () => {
        // Mock BlobServiceClient methods
        const mockUploadData = jest.fn();
        const mockBlockBlobClient = {
            uploadData: mockUploadData,
            url: 'mock_image_url',
        };
        const mockGetBlockBlobClient = jest.fn().mockReturnValue(mockBlockBlobClient);
        BlobServiceClient.fromConnectionString.mockReturnValue({
            getContainerClient: jest.fn().mockReturnValue({
                getBlockBlobClient: mockGetBlockBlobClient,
            }),
        });

        // Mock files
        const files = {
            file1: {
                name: 'mock_image1.jpg',
                mimetype: 'image/jpeg',
                data: 'mock_image_data1',
            },
            file2: {
                name: 'mock_image2.jpg',
                mimetype: 'image/jpeg',
                data: 'mock_image_data2',
            },
        };

        const imageUrls = await getImageUrls(files);

        // Expect BlobServiceClient methods to be called
        expect(mockUploadData).toHaveBeenCalledTimes(2);

        // Expect array of image URLs to be returned
        expect(imageUrls).toEqual(['mock_image_url', 'mock_image_url']);
    });
});
