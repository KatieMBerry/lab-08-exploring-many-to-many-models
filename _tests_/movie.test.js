const request = require('supertest');
const app = require('../lib/app');

describe('app endpoints', () => {
    it('creates a new Movie via POST', async () => {
        const res = await request(app)
            .post('/movies')
            .send({
                title: 'Snatch',
                yearReleased: 2000,
                director: 'Guy Richie',
                featuredSong: 'Angel'
            })

        expect(res.body).toEqual({
            id: 1,
            title: 'Snatch',
            yearReleased: 2000,
            director: 'Guy Richie',
            featuredSong: 'Angel'
        });
    });

});