const mongoose = require('mongoose');
const uniqueValidators = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Avec cette config, désormais les properties avec unique seront chéckées => pas de doublons.
userSchema.plugin(uniqueValidators);

module.exports = mongoose.model('User', userSchema);