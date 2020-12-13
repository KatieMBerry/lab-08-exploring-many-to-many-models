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

    static async insert({ title, yearReleased, director }) {
        const { rows } = await pool.query(
            `INSERT INTO movies (title, year_released, director) VALUES ($1, $2, $3)
            RETURNING *`,
            [title, yearReleased, director]
        );

        return new Movie(rows[0]);
    }

    static async find() {
        const { rows } = await pool.query('SELECT * FROM movies');

        return rows.map(row => new Movie(row));
    }

    static async findById(id) {
        const { rows } = await pool.query('SELECT * FROM movies WHERE id=$1',
            [id]
        );

        if (!rows[0]) throw new Error(`There's no movie with id ${id}`);
        return new Movie(rows[0]);
    }
}
