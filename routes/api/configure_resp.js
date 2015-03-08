var _ = require('lodash');

function configureResp(responses) {
    var newRESP = {};
    _.forEach(responses, function(r, key) {
        newRESP[key] = function(extension) {
            extension = extension || {};
            return _.extend(_.clone(r), extension);
        }
    });
    return newRESP;
}

module.exports = configureResp;