var express = require('express');
var app = express();
var redux = require('../libs');
var port = process.env.PORT || 8100;

redux.setOptions({
    saveTrace: false,
    extendIpData: true,
    errors: {
        437: 'Dabba Error'
    },
    auth: {
        external: false
    }
});

app.use(redux.mount);

app.get('/', function (req, res) {
    var redux = req.redux;
    redux.sendError(res, redux.generateError(439));
});

app.listen(port, function () {
        console.log('Example app listening on port ' + port + '!')
    }
);