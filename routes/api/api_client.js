var express = require('express');
var _ = require('lodash');
var router = express.Router();

var configureResp = require('./configure_resp');
var modelsInteractor = require('./ModelsInteractor');

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

    modelNotFound: {
        status: 404,
        msg: 'Requested model not found'
    },

    modelsSelectingError: {
        status: 503,
        msg: 'Error happened while selecting models'
    }


});

function constructNextQuestion(req) {
    var model = req.session.model;
    if (!req.session.currentQuestion) {
        req.session.currentQuestion = model.questions[0];
    } else {
        req.session.currentQuestion = model.questions[0]; // TODO: pick a question according to some logic
    }

    var q = req.session.currentQuestion;
    var qParam = req.session.model_parameters[q.param_id];
    return {
        text: q.text,
        param: qParam.param,
        type: qParam.type,
        values: qParam.values
    };
}

router.get('/init', function(req, res, next) {
    var model_id = req.query.id;
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

            var params = {};
            _.forEach(model.parameters, function(p) {
                params[p._id] = p;
            });
            req.session.model_parameters = params;

            _.forEach(model.questions, function(q) {
                var param_id = q.param_id;
                delete q.param_id;

                var param = model.parameters[param_id];
                q.param = param;
            });

            req.session.model = model;

            req.session.attributes = {};
            req.session.parameters = {};
            req.session.objects = [];

            _.forEach(model.attributes, function(a) {
                req.session.attributes[a.name] = null;
            });

            _.forEach(model.parameters, function(p) {
                req.session.parameters[p.param] = null;
            });

            res.json(RESP.ok({
                question: constructNextQuestion(req)
            }));
        })


    } else {
        res.status(400).json(RESP.modelIdIsRequired());
    }

});

router.post('/answer', function(req, res, next) {
    var sess = req.session;
    if (sess.model) {

        res.json(RESP.ok());
    } else {
        res.status(400).json(RESP.noModel());
    }
});


module.exports = router;
