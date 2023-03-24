var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/** Routers */
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');

/** DB Connection */
var dbConnection = require("./db");

// CORS middleware
const allowCrossDomain = (req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `http://localhost:4200`);
    res.header(`Access-Control-Allow-Methods`, `GET,POST`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type,token`);
    next();
};

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// CROS Access
app.use(allowCrossDomain);
app.use('/', indexRouter);
app.use('/login', loginRouter);

module.exports = app;
