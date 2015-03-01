var mongoose = require('mongoose');

var ModelSchema = new mongoose.Schema({
    author_id: {
        type: String,
        required: true
    },
    data: {
        type: JSON,
        required: true
    }
});

mongoose.model('model', ModelSchema);