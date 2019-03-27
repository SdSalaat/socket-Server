// Imports
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const webPush = require('web-push');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const app = express();
const router = express.Router();

const publicKey = "BKZ7q9GnaavKPUheKO8TkBHgRglEA1sYZtjs05Y45scAoTRVMelVj5qTddqTfF48V_JcxYL1scOT_WA9GyWhAes";
const privateKey = "YHyoFdO-PEDVlVAXVQ4WryBPlRJE9_5V8tWKT1lYurg";

webPush.setVapidDetails('mailto:abdulsamad.as.811@gmail.com', publicKey, privateKey);

// body-parser config
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));

// Cookie Parser
app.use(cookieParser());


// CORS headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");//false
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api', router);

/*The Whole Application Files*/
require('./config')(mongoose, app);
require('./app/models')(app, mongoose);
require('./app/services')(app);
require('./app/controllers')(app, webPush, fs);
require('./app/routes')(app, router);

/*The Whole Application Files*/


/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stack traces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
