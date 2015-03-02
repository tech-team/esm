var express = require('express');
var _ = require('lodash');
var router = express.Router();

var mongoose = require('mongoose');
var Model = mongoose.model('model');

function validateModel(model) {
    if (!model || model == {}) {
        return false;
    }

    var v = _.isString(model['name'])
         && _.isObject(model['data']) &&_.isArray(model['data']['attributes'])
                                      && _.isArray(model['data']['parameters'])
                                      && _.isArray(model['data']['questions']);

    return v;
}

var RESP = {
    ok: {
        status: 200,
        msg: 'ok'
    },

    invalidModel: {
        status: 401,
        msg: 'Provided model is not valid'
    },

    modelSavingError: {
        status: 501,
        msg: 'Error happened while saving a model'
    }
};

router.post('/model', function(req, res, next) {
    var model = req.body;
    if (validateModel(model)) {
        Model.create(model, function(err, saved_model) {
            if (err) {
                console.error("Error while saving model: ", err);
                res.status(500).json(RESP.modelSavingError);
                return;
            }

            res.json(_.extend(RESP.ok, {
                model_id: saved_model._id
            }));
        });


    } else {
        res.status(400).json(RESP.invalidModel);
    }
});


module.exports = router;
