const mongoose = require('mongoose');
const uniqueValidators = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required,
        unique: true
    },
    password: {
        type: String,
        required
    }
});

// Avec cette config, désormais les properties avec unique seront chécker => pas de doublons.
userSchema.plugin(uniqueValidators);

module.exports = mongoose.model('User', userSchema);