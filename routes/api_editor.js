var express = require('express');
var _ = require('lodash');
var router = express.Router();

var mongoose = require('mongoose');
var Model = mongoose.model('model');
var Attribute = mongoose.model('attribute');
var Parameter = mongoose.model('parameter');
var Question = mongoose.model('question');

function validate_attr_or_param(obj) {
    if (!_.isObject(obj) || !_.isString(obj.name) || !_.isString(obj.type)) {
        return false;
    }
    if (obj.type == 'choice') {
        if (!_.isArray(obj.values) || obj.values.length <= 1) {
            return false;
        }
    } else if (obj.type == 'number') {

    } else {
        return false;
    }
    return true;
}

function validateModel(model, checkForId) {
    if (_.isEmpty(model)) {
        return false;
    }

    if (checkForId && !_.isString(model['_id'])) {
        return false;
    }

    var v = _.isString(model['name'])
         && _.isObject(model['data']);
    var model_data = model['data'];
    v = v && _.isArray(model_data['attributes'])
          && _.isArray(model_data['parameters'])
          && _.isArray(model_data['questions'])
          && _.isArray(model_data['derivation_rules'])
    ;

    if (!v) return false;

    var attrs = model.data.attributes;
    var params = model.data.parameters;
    var questions = model.data.quetsions;

    var params_names = _.map(params, function(p) {
        return p.name;
    });

    _.forEach([attrs, params], function(arr) {
        if (arr.length === 0) {
            v = false;
            return false;
        }
        _.forEach(arr, validate_attr_or_param);
        if (!v) return false;
    });

    if (!v) return false;

    _.forEach(model_data['questions'], function(q) {
        if (!_.isObject(q) || !_.isString(q.text) || !_.isString(q.param)) {
            v = false;
            return false;
        }
        if (!_.includes(params_names, q.param)) {
            v = false;
            return false;
        }
    });

    _.forEach(model_data['derivation_rules'], function(rule) {
        if (!_.isString(rule)) {
            v = false;
            return false;
        }
    });

    if (!v) return false;

    return v;
}

function saveObj(params, index, Type, error_cb, next, target_arr) {
    target_arr = target_arr || [];
    if (index >= params.length) {
        if (next)
            next(target_arr);
    } else {
        Type.create(params[index], function (err, obj) {
            if (err) {
                error_cb(err, null);
                return;
            }
            target_arr.push(obj._id);
            saveObj(params, index + 1, Type, error_cb, next, target_arr);
        });
    }
}

function saveModel(model, cb) {
    var m_data = model.data;
    var params = m_data.parameters;
    var attrs = m_data.attributes;
    var questions = m_data.questions;
    var derivRules = m_data.derivation_rules;

    saveObj(attrs, 0, Attribute, cb, function(attrs_ids) {
        m_data.attributes = attrs_ids;
        saveObj(params, 0, Parameter, cb, function(params_ids) {
            m_data.parameters = params_ids;
            var mapped_params = _.zipObject(_.map(params, function(p){return p.name}), params_ids);
            _.forEach(questions, function(q) {
                q.param_id = mapped_params[q.param];
                delete q.param;
            });
            saveObj(questions, 0, Question, cb, function(question_ids) {
                m_data.questions = question_ids;
                Model.create(model, function(err, saved_model) {
                    cb(err, saved_model);
                });
            });
        });
    });
}

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

router.post('/model', function(req, res, next) {
    var model = req.body;
    if (validateModel(model)) {
        saveModel(model, function(err, saved_model) {
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
        res.status(400).json(RESP.invalidModel());
    }
});

router.put('/model', function(req, res, next) {
    var model = req.body;
    if (validateModel(model, true)) {
        var id = model._id;
        delete model._id;  // or mongo will try to save id as String

        Model.update(id, model, { upsert: false }, function(err) {
            if (err) {
                console.error("Error while updating model: ", err);
                res.status(500).json(RESP.modelUpdatingError());
                return;
            }

            res.json(RESP.ok());
        });


    } else {
        res.status(400).json(RESP.invalidModel());
    }
});

router.get('/model', function(req, res, next) {
    var model_id = req.query.id;
    if (model_id) {
        Model.findOne({ _id: model_id }, function(err, model) {
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
    Model.find({}, { _id: true, name: true }, function(err, models) {
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
