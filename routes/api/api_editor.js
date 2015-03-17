var express = require('express');
var _ = require('lodash');
var router = express.Router();
var modelsInteractor = require('./ModelsInteractor');
var configureResp = require('./configure_resp');
var Compiler = require('../rules_compiler/Compiler');

var mongoose = require('mongoose');
var Model = mongoose.model('model');


var RESP = configureResp({
    ok: {
        status: 200,
        msg: 'ok'
    },

    invalidModel: {
        status: 401,
        msg: 'Provided model is not valid'
    },

    modelIdIsRequired: {
        status: 402,
        msg: 'Model id is required'
    },

    modelSavingError: {
        status: 501,
        msg: 'Error happened while saving a model'
    },

    modelUpdatingError: {
        status: 502,
        msg: 'Error happened while updating a model'
    },

    modelNotFound: {
        status: 404,
        msg: 'Requested model not found'
    },

    modelsSelectingError: {
        status: 503,
        msg: 'Error happened while selecting models'
    }
});


function saveModel(model, res) {
    var validated = modelsInteractor.validate(model);
    if (validated[0]) {
        modelsInteractor.save(model, function(err, saved_model) {
            if (err) {
                console.error("Error while saving model: ", err);
                res.status(500).json(RESP.modelSavingError());
                return;
            }

            res.json(RESP.ok({
                _id: saved_model._id
            }));
        });
    } else {
        res.status(400).json(RESP.invalidModel({
            reason: validated[1]
        }));
    }
}


router.post('/model', function(req, res, next) {
    var model = req.body;
    saveModel(model, res);
});

router.post('/model/objects', function(req, res, next) {
    var data = req.body;
    modelsInteractor.validateModelObjects(data.modelId, data.objects, function(err, model, validated) {
        if (err) {
            console.error("Error while getting model: ", err);
            res.status(500).json(RESP.modelSavingError());
            return;
        }

        if (!model) {
            res.status(404).json(RESP.modelNotFound());
            return;
        }

        if (validated[0]) {
            modelsInteractor.saveObjects(model, data.objects, function(err) {
                if (err) {
                    console.error("Error while saving model: ", err);
                    res.status(500).json(RESP.modelSavingError());
                    return;
                }

                res.json(RESP.ok({
                    _id: model._id
                }));
            });
        } else {
            res.status(400).json(RESP.invalidModel({
                reason: validated[1]
            }));
        }

    });
});

router.put('/model', function(req, res, next) {
    var model = req.body;
    var validated = modelsInteractor.validate(model, true, false);
    if (validated[0]) {
        var id = model._id;
        modelsInteractor.removeModel(id, function(err, m) {
            if (err) {
                console.error("Error while removing model: ", err);
                res.status(500).json(RESP.modelUpdatingError());
                return;
            }

            if (!m) {
                res.status(404).json(RESP.modelNotFound());
                return;
            }

            saveModel(model, res);
        });
    } else {
        res.status(400).json(RESP.invalidModel({
            reason: validated[1]
        }));
    }
});

router.get('/model', function(req, res, next) {
    var model_id = req.query.id;
    if (model_id) {
        modelsInteractor.get(model_id, function(err, model) {
            if (err) {
                console.error("Error while selecting: ", err);
                res.status(500).json(RESP.modelsSelectingError());
                return;
            }

            if (model) {
                res.json(RESP.ok({
                    model: model
                }));
            } else {
                res.status(404).json(RESP.modelNotFound());
            }
        });
    } else {
        res.status(400).json(RESP.modelIdIsRequired());
    }
});

router.get('/model/list', function(req, res, next) {
    modelsInteractor.modelsList(function(err, models) {
        if (err) {
            console.error("Error while selecting: ", err);
            res.status(500).json(RESP.modelsSelectingError());
            return;
        }

        if (!models) {
            models = [];
        }

        res.json(RESP.ok({
            models: models
        }));
    });
});


module.exports = router;
