const {getRandomAddressCityPair, 
    getRandomDate, getRandomPrice, shuffleArray} = require('../../utils/utils');

beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
});

afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
});

describe('getRandomAddressCityPair', () => {
    test('returns a random city and address pair', () => {  
        const result = getRandomAddressCityPair();

        expect(result).toEqual({ city: 'Edmonton', 
            address: '4812 21 Ave NW, Edmonton, AB T6L 2V8' });
    });
});

describe('shuffleArray', () => {
    
    test('returns a shuffled array', () => {

        const inputArray = [1, 2, 3, 4, 5];
        const shuffledArray = shuffleArray(inputArray);
        const expectedShuffledArray = [1, 4, 2, 5, 3];
        expect(shuffledArray).toEqual(expectedShuffledArray);
    });
});

describe('getRandomDate', () => {
    test('returns a random date between 2024-01-01 and current date', () => {
        const mockDate = new Date('14 Oct 2024');
        global.Date = jest.fn().mockImplementation(() => mockDate); 
        global.Date.now = jest.fn().mockReturnValue(mockDate.valueOf()); 


        const result = getRandomDate();
        expect(result).toBe('2024-10-14'); 


        jest.restoreAllMocks();
    });
});

describe('getRandomPrice', () => {
    test('returns a random price for 1 BHK', () => {
        const result = getRandomPrice(1);
        expect(result).toBe(1150); 
    });
    test('returns a random price for 2 BHK', () => {
        const result = getRandomPrice(2);
        expect(result).toBe(2000); 
    });
    test('returns a random price for 3 BHK', () => {
        const result = getRandomPrice(3);
        expect(result).toBe(3150); 
    });
    test('returns a random price for 4 BHK', () => {
        const result = getRandomPrice(4);
        expect(result).toBe(4600); 
    });
    test('returns a random price for 5 BHK, aka null price', () => {
        const result = getRandomPrice(5);
        expect(result).toBe(null); 
    });
});