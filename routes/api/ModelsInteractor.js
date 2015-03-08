var _ = require('lodash');

var mongoose = require('mongoose');
var Attribute = mongoose.model('attribute');
var Parameter = mongoose.model('parameter');
var Question = mongoose.model('question');
var Model = mongoose.model('model');

function copyFields(fromObj, toObj, fields) {
    _.forEach(fields, function(f) {
        if (fromObj[f]) {
            toObj[f] = fromObj[f];
        }
    });
}

function validate_attr_or_param(obj) {
    if (!_.isObject(obj) || !(_.isString(obj.param) || _.isString(obj.name)) || !_.isString(obj.type)) {
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
            && _.isArray(model['attributes'])
                //&& _.isArray(model['parameters'])
            && _.isArray(model['questions'])
            && _.isArray(model['derivation_rules'])
        ;

    if (!v) return false;

    var attrs = model.attributes;
    //var params = model.parameters;
    var questions = model.quetsions;

    //var params_names = _.map(params, function(p) {
    //    return p.name;
    //});

    if (attrs.length === 0) {
        return false;
    }
    _.forEach(attrs, function(attr) {
        v = validate_attr_or_param(attr);
        return v;
    });

    if (!v) return false;

    model.parameters = [];

    _.forEach(model['questions'], function(q) {
        if (!_.isObject(q) || !_.isString(q.text) || !validate_attr_or_param(q)) {
            v = false;
            return false;
        }
        var p = {};
        copyFields(q, p, ['param', 'type', 'values']);
        model.parameters.push(p);
        delete q.type;
        delete q.values;
    });

    _.forEach(model['derivation_rules'], function(rule) {
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
    var params = model.parameters;
    var attrs = model.attributes;
    var questions = model.questions;
    var derivRules = model.derivation_rules;

    saveObj(attrs, 0, Attribute, cb, function(attrs_ids) {
        model.attributes = attrs_ids;
        saveObj(params, 0, Parameter, cb, function(params_ids) {
            model.parameters = params_ids;
            var mapped_params = _.zipObject(_.map(params, function(p){return p.param}), params_ids);
            _.forEach(questions, function(q) {
                q.param_id = mapped_params[q.param];
                delete q.param;
            });
            saveObj(questions, 0, Question, cb, function(question_ids) {
                model.questions = question_ids;

                // TODO: save derivation rules

                Model.create(model, function(err, saved_model) {
                    cb(err, saved_model);
                });
            });
        });
    });
}

function getModel(model_id, cb) {
    Model.findOne({_id: model_id}).populate('attributes')
                                .populate('parameters')
                                .populate('questions').exec(cb);
}

module.exports = {
    validate: validateModel,
    save: saveModel,
    get: getModel
};