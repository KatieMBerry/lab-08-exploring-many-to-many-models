const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const Actor = require('../lib/models/Actor');


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
            .send({ name: 'Jessica Chastain' });

        expect(res.body).toEqual({
            id: '1',
            name: 'Jessica Chastain'
        });
    });

    it('gets all actors via GET', async () => {
        const actors = await Promise.all([
            { name: 'Brad Pitt' },
            { name: 'Michael Caine' },
            { name: 'Matthew McConaughey' }
        ].map(actor => Actor.insert(actor)));

        const res = await request(app)
            .get('/actors');

        expect(res.body).toEqual(expect.arrayContaining(actors));
        expect(res.body).toHaveLength(actors.length);
    });

    it('finds an actor by id via GET', async () => {
        const actor = await Actor.insert({
            name: 'Matthew McConaughey'
        });

        const res = await request(app)
            .get(`/actors/${actor.id}`);

        expect(res.body).toEqual(actor);
    });

    it('updates anactor via PUT', async () => {
        const actor = await Actor.insert({
            name: 'Michael McCaine'
        });

        const res = await request(app)
            .put(`/actors/${actor.id}`)
            .send({ name: 'Michael Caine' });

        expect(res.body).toEqual({
            id: actor.id,
            name: 'Michael Caine'
        });
    });

    it('deletes an actor by id and returns it', async () => {
        const actor = await Actor.insert({ name: 'Matthew McConaughey' });

        const res = await request(app)
            .delete(`/actors/${actor.id}`);

        expect(res.body).toEqual(actor);
    });
});