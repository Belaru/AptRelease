const request = require('supertest');
const {app} = require('../api');
const {DB} = require('../db/db');

jest.mock('../db/db');
describe('GET /filters/furnishing', () => {
    test('It should return all furnishing types', async () => {
        const mockResponse = {'response': [
            'Furnished', 'Semi-Furnished', 'Unfurnished'
        ]};
        jest.spyOn(DB.prototype, 'getAllFilterList').mockResolvedValue(mockResponse);
        const response = await request(app).get('/filters/furnishing');
        expect(response.body.response).toEqual(mockResponse);
        expect(response.statusCode).toBe(200);
    });
});