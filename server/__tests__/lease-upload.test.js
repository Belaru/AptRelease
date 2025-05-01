const request = require('supertest');
const {app} = require('../api');

const modifiedProperty = {
    rentPrice: 1000,
    bhk: 3,
    floor: 2,
    address: 'Mock Address',
    pointOfContact: '123-456-7890',
    size: 100,
    bathroom: 2,
    furnishing: 'Furnished',
    postedDate: '2024-10-14',
    images:[
        'mock-url-1',
        'mock-url-2',
    ],
};
const mockUser = {
    name: 'f',
    email: 'f@gmail.com',
    picture: null,
    leases: [],
    save: jest.fn()
};
const mockFindUser = jest.fn().mockImplementation((email) => {
    if(email !== 'f@gmail.com'){
        return null;
    }
    return Promise.resolve(mockUser);
});
jest.mock('../db/db', () => ({
    DB: jest.fn().mockImplementation(() => ({
        createManyLeases: jest.fn().mockImplementation(() => {
            return Promise.resolve(modifiedProperty);
        }),
        findUser: mockFindUser
    }))
}));

jest.mock('../routes/utils/image-upload', () => ({
    getImageUrls: jest.fn().mockResolvedValue(['mock-url-1', 'mock-url-2'])
}));

describe('POST /leaseUpload/', () => {
    test('should return status 200 and upload property data', async () => {
        
        const mockDate = new Date('14 Oct 2024');
        global.Date = jest.fn().mockImplementation(() => mockDate); 
        global.Date.now = jest.fn().mockReturnValue(mockDate.valueOf()); 

        const property = {
            email: 'f@gmail.com',
            rentPrice: 1000,
            address: 'Mock Address',
            contactInfo: '123-456-7890',
            size: 100,
            bedrooms: 3,
            bathrooms: 2,
            floorNumber: 2,
            furnishing: 'Furnished'
        };

        const response = await request(app).
            post('/leaseUpload').
            send(property);
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ 'respose': modifiedProperty });
        
        jest.restoreAllMocks();


    });

    test('should return status 400 for invalid property', async () => {

        const property = {
            email: 'f@gmail.com',
            rentPrice: 1000,
            address: 'Mock Address',
            contactInfo: '123-456-7890',
            size: 100,
            bedrooms: null,
            bathrooms: 2,
            floorNumber: 2,
            furnishing: 'Furnished'
        };

        const response = await request(app).
            post('/leaseUpload').
            send(property);
            
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ 'error': 
        'Validation failed. Please provide valid property details.' });
        
        jest.restoreAllMocks();


    });

    test('should return status 404 for invalid email', async () => {

        const property = {
            email: '',
            rentPrice: 1000,
            address: 'Mock Address',
            contactInfo: '123-456-7890',
            size: 100,
            bedrooms: 3,
            bathrooms: 2,
            floorNumber: 2,
            furnishing: 'Furnished'
        };

        const response = await request(app).
            post('/leaseUpload').
            send(property);
            
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ 'error': 
        'User not found.' });
        
        jest.restoreAllMocks();


    });
});
