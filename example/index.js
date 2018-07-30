var express = require('express');
var app = express();
var reduxpress = require('../libs');
var port = process.env.PORT || 8100;
var mongoose = require('mongoose');
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
        437: 'Dabba Error'
    },
    auth: {
        external: false
    }
});

app.use(reduxpress.mount);

app.get('/', function (req, res) {
    var redux = req.redux;
    redux.sendError(res, redux.generateError(437));
});


app.get('/raw', function (req, res) {
    var redux = req.redux;
    redux.sendJSON(res, {data: 'data'}, 400);
});

app.listen(port, function () {
        console.log('Example app listening on port ' + port + '!')
    }
);

module.exports = app;
