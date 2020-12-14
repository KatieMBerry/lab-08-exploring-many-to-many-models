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

    static async findById(id) {
        const { rows } = await pool.query(
            'SELECT * FROM actors WHERE id=$1',
            [id]
        );

        if (!rows[0]) throw new Error(`No actor found for id ${id}`);

        return new Actor(rows[0]);
    }

    static async update(id, { name }) {
        const { rows } = await pool.query(
            `UPDATE actors 
          SET name=$1 
          WHERE id=$2 
          RETURNING *`,
            [name, id]
        );

        if (!rows[0]) throw new Error(`No actor found for id ${id}`);

        return new Actor(rows[0]);
    }
}