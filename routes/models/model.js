var mongoose = require('mongoose');

var ModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    attributes: [{type: mongoose.Schema.Types.ObjectId, ref: 'attribute'}],
    parameters: [{type: mongoose.Schema.Types.ObjectId, ref: 'parameter'}],
    questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'question'}]
});

mongoose.model('model', ModelSchema);