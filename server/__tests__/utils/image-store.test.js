const {getImageUrls} = require('../../utils/image-store');

describe('getImageUrls', () => {
    test('should upload images and return URLs', async () => {
        const mockGetContainerClient = jest.fn().mockReturnValue({});
        const mockUploadService = jest.fn().
            mockImplementation((filePath) => {
                return `http://${filePath}`;
            });
        const result = await getImageUrls(mockGetContainerClient, mockUploadService, 
            '__tests__/utils/data/images/interior', '__tests__/utils/data/images/extra');

        expect(result.interior.length).toBe(1);
        expect(result.extras.length).toBe(1);
        expect(result.interior[0]).
            toBe('http://__tests__/utils/data/images/interior/6126422491860895.jpg');
        expect(result.extras[0]).toBe('http://__tests__/utils/data/images/extra/6.jpg');
    });
});