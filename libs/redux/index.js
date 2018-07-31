/**
 * Created by kumardivyarajat on 22/09/16.
 */
var Model;
var Redux = require("./redux");
var Logger = require("./libs/logger/index");
var Cron = require("./libs/auth/cron");
var Routes = require("./routes");
var ReduxCrud = require("./libs/crud-router/index");
var reduxOptions = {};

/**
 * @description Set options for the redux framework
 * @example
 * {
 * }
 * @param options
 */
module.exports.setOptions = function (options) {
    reduxOptions = options;
    if(options.mongooseInstance) {
        Model = require('./model')(options.mongooseInstance)
    } else{
        Model = require('./model')(require('mongoose'))
    }
};

/**
 *
 * @param request
 * @param response
 * @param next
 */
module.exports.mount = function (request, response, next) {
    var model = new Model({
        method: request.method,
        route: request.protocol + '://' + request.get('host') + request.originalUrl,
        ipAddress: request.ip,
        appAgent: request.headers["app-agent"],
        userAgent: request.headers["user-agent"],
        accessToken: request.headers["x-access-token"] || request.query['access_token'],
        refreshToken: request.headers["x-refresh-token"],
        query: request.query,
        body: request.body,
        params: request.params,
        path: request.baseUrl,
        version: request.headers.version,
        originalUrl: request.originalUrl
    });

    var redux = new Redux(model, reduxOptions);
    request.redux = redux;
    redux.printInitMessage();
    next();
};

module.exports.startCronJobs = function () {
    Cron.run();
};

module.exports.router = function () {
    return Routes;
};


module.exports.crud = function () {
    return ReduxCrud;
};


module.exports.schema = Model;

module.exports.logger = Logger;
