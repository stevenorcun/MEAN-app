const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const chalk = require('chalk');
const router = require('./routes/posts');

// Instance express
const app = express();
// Use the middleware json()
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/posts', {useNewUrlParser: true})
                .then( () => {
                    console.log(chalk.green.inverse('Connected to mongoDB'))
                })
                .catch( err => console.log(err.message));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        "Origin, W-Request-Width, Content-type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.use('/api/posts',router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(chalk.blue.inverse(`listening on port ${port}`))
})

module.exports = app;