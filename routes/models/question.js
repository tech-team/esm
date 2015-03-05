var mongoose = require('mongoose');

var Question = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    param_id: {
        type: String,
        required: true
    }
});

mongoose.model('question', Question);