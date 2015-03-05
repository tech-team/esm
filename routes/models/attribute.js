var mongoose = require('mongoose');

var Attribute = new mongoose.Schema({
    name: {
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

mongoose.model('attribute', Attribute);