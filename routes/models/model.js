var mongoose = require('mongoose');

var ModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: JSON,
        required: true
    }
});

mongoose.model('model', ModelSchema);