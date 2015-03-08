var _ = require('lodash');

var mongoose = require('mongoose');
var Attribute = mongoose.model('attribute');
var Parameter = mongoose.model('parameter');
var Question = mongoose.model('question');
var SugObject = mongoose.model('sugobject');
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
        return [false, "Attribute or parameter has invalid structure"];
    }
    if (obj.type == 'choice') {
        if (!_.isArray(obj.values) || obj.values.length <= 1) {
            return [false, "values should be a non-empty array"];
        }
    } else if (obj.type == 'number') {

    } else {
        return [false, "Unknown attribute/parameter type"];
    }
    return [true, ""];
}

function validateModel(model, checkForId) {
    if (_.isEmpty(model)) {
        return [false, "Model is empty"];
    }

    if (checkForId && !_.isString(model['_id'])) {
        return [false, "_id is not valid"];
    }

    var v = _.isString(model['name'])
            && _.isArray(model['attributes'])
                //&& _.isArray(model['parameters'])
            && _.isArray(model['questions'])
            && _.isArray(model['derivation_rules'])
            && _.isArray(model['objects']) && model['objects'].length > 0
        ;
    var res = [v , "Base nodes (name, attributes, questions, derivation_rules, objects) are not valid"];

    if (!res[0]) return res;

    var attrs = model.attributes;
    //var params = model.parameters;
    var questions = model.quetsions;

    if (attrs.length === 0) {
        return [false, "Attributes length should not be zero"];
    }
    _.forEach(attrs, function(attr) {
        res = validate_attr_or_param(attr);
        return res[0];
    });

    if (!res[0]) return res;

    var mappedAttrs = {};
    _.forEach(attrs, function(a) {
        mappedAttrs[a.name] = a;
    });

    var hasAttr = function(attrName) {
        return !_.isUndefined(mappedAttrs[attrName]);
    };

    model.parameters = [];

    _.forEach(model['questions'], function(q) {
        if (!_.isObject(q) || !_.isString(q.text)) {
            res = [false, "question has invalid structure"];
            return false;
        }

        res = validate_attr_or_param(q);
        if (!res[0]) return false;

        var p = {};
        copyFields(q, p, ['param', 'type', 'values']);
        model.parameters.push(p);
        delete q.type;
        delete q.values;
    });

    if (!res[0]) return res;

    _.forEach(model['derivation_rules'], function(rule) {
        if (!_.isString(rule)) {
            res = [false, "Derivation rule must be a string"];
            return false;
        }
    });

    if (!res[0]) return res;

    _.forEach(model['objects'], function(obj) {
        if (!_.isObject(obj) || !_.isString(obj.name) || !_.isObject(obj.attributes) || Object.keys(obj.attributes).length != attrs.length) {
            res = [false, "Object has invalid structure"];
            return false;
        }

        _.forEach(obj.attributes, function(a, attrName) {
            if (!(mappedAttrs[attrName].type == 'choice' && _.includes(mappedAttrs[attrName].values, a)
                || mappedAttrs[attrName].type == 'number' && _.isNumber(a))) {
                res = [false, "Object's attribute value is not valid"];
                return false;
            }
        });

        return res[0];
    });

    if (!res[0]) return res;

    return res;
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

function countObjectsStats(model) {
    var stats = {};


    _.forEach(model.objects, function(o) {
        _.forOwn(o.attributes, function(attr, attrName) {
            var attrInfo = _.find(model.attributes, function(a) {
                return a.name == attrName;
            });

            if (attrInfo.type == 'number') {
                if (!_.has(stats, attrName)) {
                    stats[attrName] = {
                        min: Infinity,
                        max: 0.0
                    };
                }

                if (attr > stats[attrName].max) {
                    stats[attrName].max = attr;
                }

                if (attr < stats[attrName].min) {
                    stats[attrName].min = attr;
                }
            }
        });
    });

    model.stats = stats;
}

function saveModel(model, cb) {
    var params = model.parameters;
    var attrs = model.attributes;
    var questions = model.questions;
    var derivRules = model.derivation_rules;
    var sugObjects = model.objects;
    countObjectsStats(model);

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

                saveObj(sugObjects, 0, SugObject, cb, function(sugObjectsIds) {
                    model.objects = sugObjectsIds;
                    Model.create(model, function(err, saved_model) {
                        cb(err, saved_model);
                    });
                });
            });
        });
    });
}

function getModel(model_id, cb) {
    Model.findOne({_id: model_id}).populate('attributes')
                                .populate('parameters')
                                .populate('questions')
                                .populate('objects').exec(cb);
}

module.exports = {
    validate: validateModel,
    save: saveModel,
    get: getModel
};