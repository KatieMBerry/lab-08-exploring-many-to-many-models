const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Movie = require('../lib/models/Movie');
const Actor = require('../lib/models/Actor');


describe('movies routes', () => {

    beforeEach(() => {
        return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    });

    afterAll(() => {
        return pool.end();
    });

    it('creates a new movie via POST', async () => {
        const res = await request(app)
            .post('/movies')
            .send({
                title: 'Snatch',
                yearReleased: 2000,
                director: 'Guy Richie'
            });

        expect(res.body).toEqual({
            id: '1',
            title: 'Snatch',
            yearReleased: '2000',
            director: 'Guy Richie'
        });
    });

    it('gets all movies via GET', async () => {
        const movies = await Promise.all([
            {
                title: 'Snatch',
                yearReleased: 2000,
                director: 'Guy Richie'
            },
            {
                title: 'Interstellar',
                yearReleased: 2014,
                director: 'Christopher Nolan'
            },
            {
                title: 'Oceans 11',
                yearReleased: 2001,
                director: 'Steven Soderbergh'
            }
        ].map(movie => Movie.insert(movie)));

        const res = await request(app)
            .get('/movies');

        expect(res.body).toEqual(expect.arrayContaining(movies));
        expect(res.body).toHaveLength(movies.length);
    });

    it('finds a single movie by Id via GET, and shows the actors from the film', async () => {
        await Promise.all([
            { name: 'Matt Damon' },
            { name: 'Michael Caine' },
            { name: 'Jessica Chastain' },
            { name: 'Brad Pitt' }
        ].map(actor => Actor.insert(actor)));

        const movie = await Movie.insert({
            title: 'Interstellar',
            yearReleased: 2014,
            director: 'Christopher Nolan',
            actors: ['Matt Damon', 'Michael Caine', 'Jessica Chastain']
        });

        const res = await request(app)
            .get(`/movies/${movie.id}`);

        expect(res.body).toEqual({
            ...movie,
            actors: expect.arrayContaining(['Matt Damon', 'Michael Caine', 'Jessica Chastain'])
        });
    });

    it('updates a movie via PUT', async () => {
        const movie = await Movie.insert({
            title: 'Snatch',
            yearReleased: 2020,
            director: 'Guy Richie'
        });

        const res = await request(app)
            .put(`/movies/${movie.id}`)
            .send({
                title: 'Snatch',
                yearReleased: 2000,
                director: 'Guy Richie'
            });

        expect(res.body).toEqual({
            id: movie.id,
            title: 'Snatch',
            yearReleased: '2000',
            director: 'Guy Richie'
        });
    });

    it('deletes a movie by id via DELETE and returns it', async () => {
        const movie = await Movie.insert({
            title: 'Oceans 11',
            yearReleased: 2001,
            director: 'Steven Soderbergh'
        });

        const res = await request(app)
            .delete(`/movies/${movie.id}`);

        expect(res.body).toEqual(movie);
    });
});