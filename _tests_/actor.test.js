const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const Movie = require('../lib/models/Movie');


describe('actor routes', () => {

    beforeEach(() => {
        return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    });

    afterAll(() => {
        return pool.end();
    });

    it('creates a new actor via POST', async () => {
        const res = await request(app)
            .post('/actors')
            .send({
                name: 'Jessica Chastain'
            });

        expect(res.body).toEqual({
            id: '1',
            name: 'Jessica Chastain'
        });
    });

});