var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

var ModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    attributes: [{type: mongoose.Schema.Types.ObjectId, ref: 'attribute'}],
    parameters: [{type: mongoose.Schema.Types.ObjectId, ref: 'parameter'}],
    questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'question'}],
    orderRules: {
        type: Array,
        required: true
    },
    derivation_rules: {
        type: Array,
        required: true
    },
    compiled_rules: {
        type: Array,
        required: true
    },

    objects: [{type: mongoose.Schema.Types.ObjectId, ref: 'sugobject'}],
    stats: {
        type: Object,
        required: true
    }
});

ModelSchema.plugin(deepPopulate);

mongoose.model('model', ModelSchema);