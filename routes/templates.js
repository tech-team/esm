var express = require('express');
var router = express.Router();

var modelsInteractor = require('./api/ModelsInteractor');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/editor', function(req, res, next) {
    res.render('editor', { title: 'Express' });
});

router.get('/client', function(req, res, next) {
    modelsInteractor.modelsList(function(err, models) {
        res.render('client', { title: 'Express', models: models });
    });
});

router.get('/poll', function(req, res, next) {
    res.render('poll', { title: 'Express' });
});

router.get('/report', function(req, res, next) {
    res.render('report', { title: 'Express' });
});

router.get('/objectsManager', function(req, res, next) {
    res.render('objectsManager', { title: 'Express' });
});

module.exports = router;
