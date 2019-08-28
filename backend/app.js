const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const postRouter = require('./routes/posts');
const userRouter = require('./routes/users');
const cors = require('./startup/cors');

// EXPRESS INSTANCE
const app = express();

// Use cors
app.use(cors);

// CONNEXION TO MONGO
require('./startup/db')();

// Use the middleware json()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// On autorise l'accès au fichier "images" de notre serveur afin que le front puisse upload
// Pour le fichier image => on utilise le middleware static() pour permettre
// toute requête vers des file présent dans ce dossier.
app.use("/images", express.static(__dirname + '/images'));

app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(chalk.blue.inverse(`listening on port ${port}`))
})

module.exports = app;