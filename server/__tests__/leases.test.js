/* eslint-disable max-len */
const request = require('supertest');
const {app} = require('../api');
const {DB} = require('../db/db');

jest.mock('../db/db');

describe('GET /leases/', () => {
    test('It should return all leases', async () => {
        const mockResponse = {'response':[
            {'_id':'65f09ec24638f47198053e24', 'postedDate':'2024-01-13', 'bhk':2, 
                'rentPrice':2260, 'size':1100, 'floor':'Ground out of 2', 
                'address':'191 Rouge Rd, Winnipeg, MB R3K 1J6', 'city':'Winnipeg', 
                'furnishing':'Unfurnished', 'preferredTentant':'Bachelors/Family', 'bathroom':2, 
                'pointOfContact':'Contact Owner', 'description':null, 
                'images':[
                    'https://azure2134398.blob.core.windows.net/test/486270562401877917.jpg', 
                    'https://azure2134398.blob.core.windows.net/test/569377484757626220.jpg', 
                    'https://azure2134398.blob.core.windows.net/test/621.jpg', 
                    'https://azure2134398.blob.core.windows.net/test/383585474952906101.jpg'
                ]},
            {'_id':'65f09ec24638f47198053e25', 'postedDate':'2024-03-05', 'bhk':2, 
                'rentPrice':2270, 'size':800, 'floor':'1 out of 3', 
                'address':'8745 151 St NW, Edmonton, AB T5R 1H8', 'city':'Edmonton', 
                'furnishing':'Semi-Furnished', 'preferredTentant':'Bachelors/Family', 'bathroom':1, 
                'pointOfContact':'Contact Owner', 'description':null, 
                'images':[
                    'https://azure2134398.blob.core.windows.net/test/410634209720680660.jpg', 
                    'https://azure2134398.blob.core.windows.net/test/531098564368947116.jpg', 
                    'https://azure2134398.blob.core.windows.net/test/3026988627694289001.jpg', 
                    'https://azure2134398.blob.core.windows.net/test/708.jpg'
                ]}
        ]};
        jest.spyOn(DB.prototype, 'getAllLeases').mockResolvedValue(mockResponse);
        const response = await request(app).get('/leases/');
        expect(response.body.response).toEqual(mockResponse);
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /leases/Toronto?furnishing=Unfurnished&minRent=1000&maxRent=2000', () => {
    test('It should return filtered leases', async () => {
        const mockResponse = {'response':[
            {'_id':'65f09ec24638f47198053e39', 'postedDate':'2024-01-18', 'bhk':2, 
                'rentPrice':1500, 'size':900, 'floor':'10 out of 15', 
                'address':'250 Dawlish Ave, North York, ON M4N 1J3', 'city':'Toronto', 
                'furnishing':'Unfurnished', 'preferredTentant':'Bachelors/Family', 'bathroom':2, 
                'pointOfContact':'Contact Agent', 'description':null, 
                'images':[
                    'https://azure2134398.blob.core.windows.net/test/537237998364429189.jpg', 
                    'https://azure2134398.blob.core.windows.net/test/499985316136411928.jpg', 
                    'https://azure2134398.blob.core.windows.net/test/708.jpg', 
                    'https://azure2134398.blob.core.windows.net/test/3160829741043027440.jpg'
                ]}, 
            {'_id':'65f09ec24638f47198053e7b', 'postedDate':'2024-02-16', 'bhk':2, 
                'rentPrice':1790, 'size':1250, 'floor':'2 out of 3', 
                'address':'13 Stayner Ave, North York, ON M6B 1N3', 'city':'Toronto', 
                'furnishing':'Unfurnished', 'preferredTentant':'Bachelors/Family', 'bathroom':2, 
                'pointOfContact':'Contact Owner', 'description':null, 
                'images':[
                    'https://azure2134398.blob.core.windows.net/test/526123703573496324.jpg', 
                    'https://azure2134398.blob.core.windows.net/test/561032646239992387.jpg', 
                    'https://azure2134398.blob.core.windows.net/test/717.jpg', 
                    'https://azure2134398.blob.core.windows.net/test/3115761877181109966.jpg'
                ]}
        ]};
        jest.spyOn(DB.prototype, 'getLeasesByCityAndFilters').mockResolvedValue(mockResponse);
        const response = await request(app).
            get('/leases/Toronto?furnishing=Unfurnished&minRent=1000&maxRent=2000');
        expect(response.body.response).toEqual(mockResponse);
        expect(response.statusCode).toBe(200);
    });

    test('It should return a 400 error if invalid query parameters are provided', async () => {
    
        const errorValue = {'error': 'Bedrooms value must be a non-negative integer'};
        jest.spyOn(DB.prototype, 'getLeasesByCityAndFilters').mockResolvedValue(new Error(errorValue.error));
        // Making a request with invalid query parameters
        const response = await request(app).
            get('/leases/Toronto?bedroom=tt');

        // Expecting a 400 response status
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toEqual(errorValue.error);
    });
});