const { reArrangeData, readCsvFile, getAllLeases} = require('../../utils/data-init.js');


const mockShuffleArray = jest.fn();

describe('reArrangeData', () => {
    // Test case 1: Test shuffling of interior and extras arrays
    test('shuffles interior and extras arrays', () => {
        const interior = [1, 2, 3, 4, 5];
        const extras = [6, 7, 8, 9, 10];

        reArrangeData([], interior, extras, mockShuffleArray);

        expect(mockShuffleArray).toHaveBeenCalledWith(interior);
        expect(mockShuffleArray).toHaveBeenCalledWith(extras);
    });

    // Test case 2: Test rearranging data
    test('rearranges data correctly', () => {
        const interior = ['int1', 'int2', 'int3'];
        const extras = ['ext1', 'ext2', 'ext3'];

        const data = [
            { id: 1, images: [] },
            { id: 2, images: [] },
            { id: 3, images: [] }
        ];

        mockShuffleArray.mockImplementation(array => array);

        const rearrangedData = reArrangeData(data, interior, extras, mockShuffleArray);


        expect(rearrangedData[0].images).toEqual(['int1', 'int2', 'ext1', 'ext2']);
        expect(rearrangedData[1].images).toEqual(['int3', 'int1', 'ext3', 'ext1']);
        expect(rearrangedData[2].images).toEqual(['int2', 'int3', 'ext2', 'ext3']);
    });
});


const mockGetRandomDate = jest.fn();
const mockGetRandomAddressCityPair = jest.fn();
const mockGetRandomPrice = jest.fn();

describe('readCsvFile', () => {
    
    test('should correctly read read leases', async () => {
        mockGetRandomDate.mockReturnValue('2024-01-01');
        mockGetRandomAddressCityPair.mockReturnValue({ address: 'MockAddress', city: 'MockCity' });
        mockGetRandomPrice.mockReturnValue(1000);


        const result = await readCsvFile('__tests__/utils/data/leases.csv', 
            mockGetRandomDate, mockGetRandomAddressCityPair, mockGetRandomPrice);
        expect(result).toEqual([
            {
                'postedDate': '2024-01-01',
                'bhk': 'value2',
                'rentPrice': 1000,
                'size': 'value4',
                'floor': 'value5',
                'address': 'MockAddress',
                'city': 'MockCity',
                'furnishing': 'value9',
                'preferredTentant': 'value10',
                'bathroom': 'value11',
                'pointOfContact': 'value12',
                'description': null,
                'images': null,
                'reports':0
            }
        ]);
    });
});


const mockReadCsvFile = jest.fn();
const mockGetImageUrls = jest.fn();
const mockReArrangeData = jest.fn();

describe('getAllLeases', () => {
    
    test('returns leases', async () => {

        mockGetImageUrls.mockResolvedValue({ interior: [], extras: [] });
        const mockData = [
            {
                'postedDate': '2024-01-01',
                'bhk': 'Value2',
                'rentPrice': 1000,
                'size': 'Value4',
                'floor': 'Value5',
                'address': 'MockAddress',
                'city': 'MockCity',
                'furnishing': 'Value8',
                'preferredTentant': 'Value9',
                'bathroom': 'Value10',
                'pointOfContact': 'Value11',
                'description': null,
                'images': null,
                'reports':0
            }
        ];
        mockReadCsvFile.mockResolvedValue(mockData);
        mockReArrangeData.mockReturnValue(mockData);

        const result = await getAllLeases(mockGetImageUrls, 
            mockReadCsvFile, mockReArrangeData, 'mockFilePath');
        
        expect(result).toEqual(mockData);
    });
    test('should log error when an error occurs', async () => {
        const mockError = new Error('Image URL error');
        mockGetImageUrls.mockRejectedValue(mockError);

        console.error = jest.fn();

        await getAllLeases(mockGetImageUrls, 'mockFilePath', mockReadCsvFile, mockReArrangeData);

        expect(console.error).toHaveBeenCalledWith('Error in fetching data for seed:', mockError);
    });
});