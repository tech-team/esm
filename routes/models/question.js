var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

var Question = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    param_id: {
        type: String,
        required: true
    },
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
        required: true
    }
});
Question.plugin(deepPopulate);

mongoose.model('question', Question);