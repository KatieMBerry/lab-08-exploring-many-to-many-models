const express = require('express');
const app = express();


//endpoints
app.get('/', (req, res, next) => {
    res.send({ hello: 'world' });
});


module.exports = app;