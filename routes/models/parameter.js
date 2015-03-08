var mongoose = require('mongoose');

var Parameter = new mongoose.Schema({
    param: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    values: {
        type: Array,
        required: false
    }
});

mongoose.model('parameter', Parameter);