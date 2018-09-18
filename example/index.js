var express = require('express');
var app = express();
var reduxpress = require('../libs');
var port = process.env.PORT || 8100;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/myapp', {}, function (err) {
    if (err) {
        console.log('Error connecting to database', err);
    } else {
        console.log('Connected to database');
    }
});


reduxpress.setOptions({
    saveTrace: true,
    extendIpData: true,
    errors: {
        437: 'This error will be sent. Handle it carefully. Its hot!!'
    },
    auth: {
        external: false
    },
    authCallback: function (userData) {
        return new Promise(function (resolve, reject) {
            userData._id = 'adsad';
            resolve(userData);
        });
    }
});

app.use(reduxpress.mount);
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.get('/', function (req, res) {
    var redux = req.redux;
    redux.sendError(res, redux.generateError(437));
});


app.get('/raw', function (req, res) {
    var redux = req.redux;
    redux.sendJSON(res, {data: 'data'});
});

app.post('/', function (req, res) {
    var redux = req.redux;
    var params = ["sso", "^email", "firstname", "phone"];

    redux.log({a: 'b'});
    redux.log([{a: 'b'}, {a: 'c'}, {a: 'd'}], 'data');
    redux.bodyValidator(req, params)
        .then(function (result) {
            redux.sendSuccess(res, result, 'body')
        })
        .catch(function (err) {
            redux.err(err);
            redux.printTrace();
            redux.sendError(res, err);
        })
});

app.get('/testAuthCallback', function (req, res) {
    var redux = req.redux;

    redux.generateToken({name: 'Kumar Rajat'}, 60, 60, 'seconds')
        .then(function (token) {
            req.headers['x-access-token'] = token['x_access_token'];
            return redux.tokenValidator(req)
        })
        .then(function (data) {
            console.log(redux.currentUser);
            redux.sendSuccess(res, data);
        })
        .catch(function (err) {
            console.error(err);
            redux.sendError(res, err);
        });
});

app.listen(port, function () {
        console.log('Example app listening on port ' + port + '!')
    }
);

module.exports = app;
