const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    content: {
        type: String,
        required: true,
        maxlength: 255
    }
})

module.exports = mongoose.model('Post', postSchema);