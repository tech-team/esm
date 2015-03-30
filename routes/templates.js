var express = require('express');
var router = express.Router();

var modelsInteractor = require('./api/ModelsInteractor');

var partials = {
    pageTitle: 'pageTitle',
    pageFooter: 'pageFooter',
    alerts: 'alerts'
};

router.get('/', function(req, res, next) {
	console.log("HIT SLASH");
    res.render('modelList', {
        partials: partials,
        title: 'model list'
    });
});

router.get('/editor', function(req, res, next) {
    res.render('editor', {
        partials: partials,
        title: 'editor'
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
