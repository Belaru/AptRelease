const request = require('supertest');
const {app} = require('../api');

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
        findLeaseById: mockFindLeaseById,
        deleteLease: jest.fn(),
        findUser: mockFindUser
    })),
}));

describe('DELETE leaseDelete/:leaseId', () => {
    test('should delete the lease by id successfully', async () => {

        const response = await request(app).
            delete('/leaseDelete/65fa52163b35ce14fd8e47ae').
            send({ email: 'f@gmail.com' });

        // expect(response.status).toBe(200);
        expect(response.body).
            toEqual({ message: 'Lease deleted successfully'});
    });
    test('should give error invalid format for id', async () => {

        // wrong format of id
        const response = await request(app).
            delete('/leaseDelete/65fa52');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid ID format'});
    });

    test('should give error for id not found', async () => {

        // id non existent
        const response = await request(app).
            delete('/leaseDelete/65fa52163b35ce14fd8e47a4');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Lease not found'});
    });

    test('should return status 404 for invalid email', async () => {

        
        const response = await request(app).
            delete('/leaseDelete/65fa52163b35ce14fd8e47ae');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'User not found'});


    });

});
