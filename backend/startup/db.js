const mongoose = require('mongoose');
const config = require('config');
const chalk = require('chalk');

module.exports = function(){
    const db = config.get('db');
    const url = config.get('url');
    mongoose.set('useCreateIndex', true);
    // Asunchone => Renvoie un promesse => then() and catc( err );
    mongoose.connect(url+db, {useNewUrlParser: true, useFindAndModify: false })
        .then( () => {
            console.log(chalk.blue.inverse('Connected to mongo db'));
        })
        .catch(err => {
            console.log(chalk.red.inverse(err));
        })
}