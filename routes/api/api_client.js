var express = require('express');
var _ = require('lodash');
var router = express.Router();

var configureResp = require('./configure_resp');
var modelsInteractor = require('./ModelsInteractor');
var Compiler = require('../rules_compiler/Compiler');
var OrderRulesTree = require('./tree/OrderRulesTree');

var RESP = configureResp({
    ok: {
        status: 200,
        msg: 'ok'
    },

    noModel: {
        status: 401,
        msg: 'No associated model found. Make sure you call /api/client/init?=model_id=YOUR_MODEL_ID'
    },

    modelIdIsRequired: {
        status: 402,
        msg: 'Model id is required'
    },

    noAnswer: {
        status: 403,
        msg: 'No answer provided'
    },

    modelNotFound: {
        status: 404,
        msg: 'Requested model not found'
    },

    answerIsNotValid: {
        status: 405,
        msg: 'Answer is not valid'
    },

    modelsSelectingError: {
        status: 503,
        msg: 'Error happened while selecting models'
    }


});

function nn(orderRules, currentQuestion, user_ans, questions) {
    var orderRule = _.find(orderRules, function(orderRule) {
        if (currentQuestion.type == 'choice' && orderRule.value == user_ans) {
            return true;
        } else if (currentQuestion.type == 'number') {
            switch (orderRule.op) {
                case '==':
                    return user_ans == orderRule.value;
                case '<':
                    return user_ans < orderRule.value;
                case '>':
                    return user_ans > orderRule.value;
                case '<=':
                    return user_ans <= orderRule.value;
                case '>=':
                    return user_ans >= orderRule.value;
            }
        }
    });

    var nextQuestion = _.find(questions, function(q) {
        return q.param == orderRule.to;
    });

    return nextQuestion;
}

function buildOrderRulesTree(orderRules, questions) {
    var qs = {};

    _.forEach(questions, function(q) {
        qs[q.param] = q;
    });

    var tree = new OrderRulesTree(questions);

    _.forEach(orderRules, function(orderRule) {
        tree.addConnection(qs[orderRule.from],
                           qs[orderRule.to],
                           orderRule.op,
                           orderRule.value);
    });
    return tree;
}

function constructNextQuestion(req, user_ans) {
    var model = req.session.model;

    var q = null;
    if (!req.session.currentQuestion) {
        q = model.questions[0];
    } else {
        console.log(model.orderRules);
        q = model.questions[0]; // TODO: pick a question according to some logic
    }

    var qParam = req.session.model_parameters[q.param_id];
    q = {
        text: q.text,
        param: qParam.param,
        type: qParam.type,
        values: qParam.values
    };

    req.session.currentQuestion = q;
    return q;
}


function executeDerivRules(req) {
    var params = req.session.parameters;
    var attrs = req.session.attributes;

    _.forEach(req.session.model.compiled_rules, function(stmt) {
        var stmtJs = Compiler.createFunction(stmt, console.error.bind(console));
        if (stmtJs != null) {
            stmtJs(params, attrs);
        } else {
            console.warn("derivation rule compiled statement is null");
        }
    });
}

function attrsSimilarity(req, userAttrs, objAttrs) {
    var description = req.session.model_attrs_description;
    var attrsCount = Object.keys(description).length;
    var nonNumericAttrsCount = 0;

    var numericSim = 0.0;
    var nonNumericSim = 0.0;
    console.log(userAttrs);
    _.forOwn(userAttrs, function(attr, attrName) {
        var objValue = objAttrs[attrName];
        var userValue = attr;

        if (!_.isNull(userValue)) {
            var type = description[attrName].type;
            switch (type) {
                case 'choice':
                    nonNumericSim += (userValue == objValue);
                    ++nonNumericAttrsCount;
                    break;

                case 'number':
                    var norm = req.session.model.stats[attrName].max - req.session.model.stats[attrName].min;
                    numericSim += objValue * userValue / (norm * norm);
                    break;
            }
        }
    });

    if (nonNumericAttrsCount !== 0) {
        nonNumericSim /= nonNumericAttrsCount;
    }
    var sim = (numericSim + nonNumericSim) / attrsCount;
    return sim;
}

function calculateObjects(req) {
    var modelObjects = req.session.model.objects;
    var userAttrs = req.session.attributes;
    var userObjects = [];

    _.forEach(modelObjects, function(obj) {
        var sim = attrsSimilarity(req, userAttrs, obj.attributes);
        userObjects.push({
            o: obj,
            rank: sim
        });
    });
    req.session.objects = _.sortBy(userObjects, 'rank');
}

function acceptAnswer(req, answer, successCb, errorCb) {
    var currentQuestion = req.session.currentQuestion;
    var userParams = req.session.parameters;

    if (_.has(userParams, currentQuestion.param)
        && (currentQuestion.type == 'choice' && _.includes(currentQuestion.values, answer)
            || currentQuestion.type == 'number' && _.isNumber(answer))) {
        userParams[currentQuestion.param] = answer;
        successCb();
    } else {
        errorCb();
    }
}


router.post('/init', function(req, res, next) {
    var model_id = req.body.id;
    if (model_id) {
        modelsInteractor.get(model_id, function(err, model) {
            if (err) {
                console.error("Error while selecting: ", err);
                res.status(500).json(RESP.modelsSelectingError());
                return;
            }

            if (!model) {
                res.status(404).json(RESP.modelNotFound());
                return;
            }

            req.session.model = model;


            var attrs = {};
            _.forEach(model.attributes, function(a) {
                attrs[a.name] = a;
            });
            req.session.model_attrs_description = attrs;

            var params = {};
            _.forEach(model.parameters, function(p) {
                params[p._id] = p;
            });
            req.session.model_parameters = params;

            //_.forEach(model.questions, function(q) {
            //    var param_id = q.param_id;
            //    delete q.param_id;
            //
            //    var param = req.session.model_parameters[param_id];
            //    q.param = param;
            //});

            req.session.attributes = {};
            req.session.parameters = {};
            req.session.objects = [];

            _.forEach(model.attributes, function(a) {
                req.session.attributes[a.name] = null;
            });

            _.forEach(model.parameters, function(p) {
                req.session.parameters[p.param] = null;
            });

            req.session.orderTree = buildOrderRulesTree(req.session.model.orderRules, req.session.model.questions);

            res.json(RESP.ok({
                question: constructNextQuestion(req)
            }));
        });

    } else {
        res.status(400).json(RESP.modelIdIsRequired());
    }

});

router.post('/answer', function(req, res, next) {
    var sess = req.session;

    if (!sess.model) {
        res.status(400).json(RESP.noModel());
        return;
    }

    var user_ans = req.body.answer;
    if (!user_ans) {
        res.status(400).json(RESP.noAnswer());
        return;
    }
    acceptAnswer(req, user_ans,
        function() {
            executeDerivRules(req);
            calculateObjects(req);
            res.json(RESP.ok({
                objects: req.session.objects,
                params: req.session.parameters,
                attrs: req.session.attributes,
                question: constructNextQuestion(req, user_ans)
            }));
        },
        function() {
            res.json(RESP.answerIsNotValid());
        }
    );
});

router.get('/results', function(req, res, next) {
    if (!req.session.model) {
        res.status(400).json(RESP.noModel());
        return;
    }

    res.json(RESP.ok({
        objects: req.session.objects,
        params: req.session.parameters,
        attrs: req.session.attributes
    }));
});


module.exports = router;
