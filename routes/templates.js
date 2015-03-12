var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/editor', function(req, res, next) {
    res.render('editor', { title: 'Express' });
});

router.get('/client', function(req, res, next) {
    res.render('client', { title: 'Express' });
});

router.get('/poll', function(req, res, next) {
    res.render('poll', { title: 'Express' });
});

router.get('/report', function(req, res, next) {
    res.render('report', { title: 'Express' });
});

router.get('/testRunner', function(req, res, next) {
    res.render('testRunner', { title: 'Express' });
});

module.exports = router;
