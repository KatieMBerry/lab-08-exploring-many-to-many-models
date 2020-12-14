const express = require('express');
const app = express();
const Movie = require('./models/Movie');
const Actor = require('./models/Actor');

app.use(express.json());

//movies endpoints
app.post('/movies', (req, res, next) => {
    Movie
        .insert(req.body)
        .then(movie => res.send(movie))
        .catch(next);
});

app.get('/movies', (req, res, next) => {
    Movie
        .find()
        .then(movie => res.send(movie))
        .catch(next);
});

app.get('/movies/:id', (req, res, next) => {
    Movie
        .findById(req.params.id)
        .then(movie => res.send(movie))
        .catch(next);
});

app.put('/movies/:id', (req, res, next) => {
    Movie
        .update(req.params.id, req.body)
        .then(movie => res.send(movie))
        .catch(next);
});

app.delete('/movies/:id', (req, res, next) => {
    Movie
        .delete(req.params.id)
        .then(movie => res.send(movie))
        .catch(next);
});

//actor endpoints
app.post('/actors', (req, res, next) => {
    Actor
        .insert(req.body)
        .then(actor => res.send(actor))
        .catch(next);
});

module.exports = app;