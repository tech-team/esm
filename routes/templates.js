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

module.exports = router;
