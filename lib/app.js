const express = require('express');
const app = express();
const Movie = require('./models/Movie');

app.use(express.json());

//movies endpoints
app.post('/movies', (req, res, next) => {
    Movie
        .insert(req.body)
        .then(movie => res.send(movie))
        .catch(next);
});

module.exports = app;