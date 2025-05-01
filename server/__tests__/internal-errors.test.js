const request = require('supertest');
const {app} = require('../api');

// for mocking db functions that throw errors

const mockLease = {
    _id: '65fa52163b35ce14fd8e47ae',
    rentPrice: 1000,
    address: 'Mock Address',
    contactInfo: '123-456-7890',
    size: 100,
    bedrooms: 3,
    bathrooms: 2,
    floorNumber: 2,
    furnishing: 'Furnished',
    reports: 0
};

const mockFindLeaseById = jest.fn().mockImplementation((id) => {
    if(id !== '65fa52163b35ce14fd8e47ae'){
        return null;
    }
    return Promise.resolve(mockLease);
});

jest.mock('../db/db', () => ({
    DB: jest.fn().mockImplementation(() => ({
        findLeaseById: mockFindLeaseById,
        updateLease: jest.fn().mockImplementation(() => {
            throw new Error('Mock error from updateLease');
        }),
        deleteLease: jest.fn().mockImplementation(() => {
            throw new Error('Mock error from deleteLease');
        }),
        createManyLeases: jest.fn().mockImplementation(() => {
            throw new Error('Mock error from createManyLeases');
        }),
    })),
}));

describe('POST leaseReport/:leaseId', () => {
    
    test('should give internal error because of db', async () => {

        const response = await request(app).
            post('/leaseReport/65fa52163b35ce14fd8e47ae');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal server error'});
    });
});

describe('DELETE leaseDelete/:leaseId', () => {
    test('should give internal error because of db', async () => {

        // id non existent
        const response = await request(app).
            delete('/leaseDelete/65fa52163b35ce14fd8e47ae');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal server error'});
    });

});

jest.mock('../routes/utils/image-upload', () => ({
    getImageUrls: jest.fn().mockResolvedValue(['mock-url-1', 'mock-url-2'])
}));

describe('POST /leaseUpload/', () => {
    test('should give internal error because of db', async () => {

        const property = {
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
            
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal server error'});

    });
});
