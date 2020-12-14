const pool = require('../utils/pool');

module.exports = class Movie {
    id;
    title;
    yearReleased;
    director;

    constructor(row) {
        this.id = String(row.id);
        this.title = row.title;
        this.yearReleased = String(row.year_released);
        this.director = row.director;
    }

    static async insert({ title, yearReleased, director, actors = [] }) {
        const { rows } = await pool.query(
            `INSERT INTO movies (title, year_released, director) VALUES ($1, $2, $3)
            RETURNING *`,
            [title, yearReleased, director]
        );

        //associates two tables...insert into junction table actors array for each movie
        //rows[0] on line 27 is received from newly inserted movie
        await pool.query(
            `INSERT INTO movies_actors (movie_id, actor_id)
            SELECT ${rows[0].id}, id FROM actors WHERE name = ANY($1::text[])`,
            [actors]
        );

        return new Movie(rows[0]);
    }

    static async find() {
        const { rows } = await pool.query('SELECT * FROM movies');

        return rows.map(row => new Movie(row));
    }

    static async findById(id) {
        const { rows } = await pool.query(
            `SELECT
               movies.*,
               array_agg(actors.name) AS names
            FROM 
               movies_actors
            JOIN movies
            ON movies_actors.movie_id = movies.id
            JOIN actors
            ON movies_actors.actor_id = actors.id
            WHERE movies.id=$1
            GROUP BY movies.id`,
            [id]
        );

        if (!rows[0]) throw new Error(`There's no movie with id ${id}`);

        return {
            ...new Movie(rows[0]),
            actors: rows[0].actors
        };
    }

    static async update(id, { title, yearReleased, director }) {
        const { rows } = await pool.query(
            `UPDATE movies 
            SET 
            title=$1,
            year_released=$2,
            director=$3
            WHERE id=$4 
            RETURNING *`,
            [title, yearReleased, director, id]
        );

        if (!rows[0]) throw new Error(`There's no movie with id ${id}`);

        return new Movie(rows[0]);
    }

    static async delete(id) {
        const { rows } = await pool.query(
            `DELETE FROM movies
            WHERE id=$1
            RETURNING *`,
            [id]
        );

        if (!rows[0]) throw new Error(`There's no movie with id ${id}`);

        return new Movie(rows[0]);
    }
}
