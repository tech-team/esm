var mongoose = require('mongoose');

var DerivationRule = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: JSON,
        required: true
    }
});

mongoose.model('derivation_rule', DerivationRule);