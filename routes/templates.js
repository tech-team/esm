var express = require('express');
var router = express.Router();

var modelsInteractor = require('./api/ModelsInteractor');

var partials = {
    pageTitle: 'pageTitle'
};

router.get('/', function(req, res, next) {
    res.render('index', {
        partials: partials,
        title: 'index'
    });
});

router.get('/editor', function(req, res, next) {
    res.render('editor', {
        partials: partials,
        title: 'editor'
    });
});

router.get('/client', function(req, res, next) {
    res.render('client', {
        partials: partials,
        title: 'client'
    });
});

router.get('/poll', function(req, res, next) {
    res.render('poll', {
        partials: partials,
        title: 'poll'
    });
});

router.get('/report', function(req, res, next) {
    res.render('report', {
        partials: partials,
        title: 'report'
    });
});

router.get('/objectsManager', function(req, res, next) {
    res.render('objectsManager', {
        partials: partials,
        title: 'objects manager'
    });
});

module.exports = router;
