const request = require('supertest');
const app = require('../lib/app');

describe('app endpoints', () => {
    it('creates a new Movie via POST', async () => {
        const res = await request(app)
            .get('/');

        expect(res.body).toEqual({ hello: 'world' });
    });

});