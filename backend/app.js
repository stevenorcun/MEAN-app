const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const chalk = require('chalk');
const postRouter = require('./routes/posts');
const userRouter = require('./routes/users');

// EXPRESS INSTANCE
const app = express();

// CONNEXION TO MONGO
mongoose.connect('mongodb://127.0.0.1:27017/posts', {useNewUrlParser: true})
                .then( () => {
                    console.log(chalk.green.inverse('Connected to mongoDB'))
                })
                .catch( err => console.log(err.message));

// Use the middleware json()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// On autorise l'accès au fichier "images" de notre serveur afin que le front puisse upload
// Pour le fichier image => on utilise le middleware static() pour permettre
// toute requête vers des file présent dans ce dossier.
app.use("/images", express.static(__dirname + '/images'));

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

app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(chalk.blue.inverse(`listening on port ${port}`))
})

module.exports = app;