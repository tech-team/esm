var mongoose = require('mongoose');

var SugObject = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    attributes: {
        type: Object,
        required: true
    }
});

mongoose.model('sugobject', SugObject);