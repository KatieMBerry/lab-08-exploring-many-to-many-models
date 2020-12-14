const pool = require('../utils/pool');

module.exports = class Actor {
    id;
    name;

    constructor(row) {
        this.id = String(row.id);
        this.name = row.name;
    }

    static async insert({ name }) {
        const { rows } = await pool.query('INSERT INTO actors (name) VALUES ($1) RETURNING *',
            [name]
        );

        return new Actor(rows[0]);
    }

    static async find() {
        const { rows } = await pool.query('SELECT * FROM actors');

        return rows.map(row => new Actor(row));
    }
}