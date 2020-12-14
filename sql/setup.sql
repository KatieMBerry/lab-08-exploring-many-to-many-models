DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS actors;

CREATE TABLE movies (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    year_released INTEGER NOT NULL,
    director TEXT
);

CREATE TABLE actors (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL
);

-- CREATE TABLE movies_actors (
--     movie_id BIGINT REFERENCES movies(id),
--     actor_id BIGINT REFERENCES actors(id),
--     PRIMARY KEY(movie_id, actor_id)
-- );