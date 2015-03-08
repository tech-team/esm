var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');
var requireTree = require('require-tree');

// connect to mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/express-system', function(err) {
    if (err) {
        console.error("Unable to connect to MongoDB server", err);
        process.exit(-1);
    }
});

// initialize models
var models = requireTree('./routes/models/');

var templates = require('./routes/templates');
var api_editor = require('./routes/api/api_editor');
var api_client = require('./routes/api/api_client');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'purr cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', templates);
app.use('/api/editor', api_editor);
app.use('/api/client', api_client);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
//
//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});


module.exports = app;
