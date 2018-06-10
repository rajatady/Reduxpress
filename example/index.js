var express = require('express');
var app = express();
var reduxpress = require('../libs');
var port = process.env.PORT || 8100;

reduxpress.setOptions({
    saveTrace: false,
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
    redux.sendError(res, redux.generateError(439));
});

app.listen(port, function () {
        console.log('Example app listening on port ' + port + '!')
    }
);

module.exports = app;
