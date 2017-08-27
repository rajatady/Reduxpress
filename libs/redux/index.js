/**
 * Created by kumardivyarajat on 22/09/16.
 */
var Model = require("./model");
var Redux = require("./redux");
var Logger = require("./libs/logger/index");
var Cron = require("./libs/auth/cron");
var Routes = require("./routes");
var ReduxCrud = require("./libs/crud-router/index");


module.exports.mount = function (request, response, next) {
    var model = new Model({
        method: request.method,
        route: request.protocol + '://' + request.get('host') + request.originalUrl,
        ipAddress: request.ip,
        appAgent: request.headers["app-agent"],
        userAgent: request.headers["user-agent"],
        accessToken: request.headers["x-access-token"],
        refreshToken: request.headers["x-refresh-token"],
        version: request.headers.version
    });

    var redux = new Redux(model);
    request.redux = redux;
    redux.printInitMessage();
    next();
        
  

};

module.exports.startCronJobs = function () {
    Cron.run();
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

module.exports.logger = Logger;
