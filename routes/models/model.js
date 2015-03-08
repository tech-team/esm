var mongoose = require('mongoose');

var ModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    attributes: [{type: mongoose.Schema.Types.ObjectId, ref: 'attribute'}],
    parameters: [{type: mongoose.Schema.Types.ObjectId, ref: 'parameter'}],
    questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'question'}],
    derivation_rules: {
        type: Array,
        required: true
    },
    objects: [{type: mongoose.Schema.Types.ObjectId, ref: 'sugobject'}],
    stats: {
        type: Object,
        required: true
    }
});

mongoose.model('model', ModelSchema);