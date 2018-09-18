var Model;
var Redux = require("./redux");
var Logger = require("./libs/logger/index");
var Cron = require("./libs/auth/cron");
var Routes = require("./routes");
var ReduxCrud = require("./libs/crud-router/index");
var reduxOptions = {};
var _ = require('lodash');

/**
 * @module reduxpress
 */

/**
 * @description Set options for the redux framework
 * @example
 * {
 *      reduxpress.setOptions({
 *          saveTrace : false
 *      });
 * }
 * @param {Object} options
 * @param {Boolean} options.saveTrace Whether the generated logs should be save
 * @param {Boolean} options.ipHeader Which header to parse in order to get the IP address of user. Defaults to the express default.
 * @param {String} options.mongooseInstance The mongoose instance for saving the data when the storage engine is db
 * @param {Boolean} options.extendIpData Whether or not to extend the IP address data
 * @param {String} options.engine The storage engine to use. Either file or db. Defaults to db.
 * @param {Boolean} options.auth.external Is the authentication logic local or external
 * @param {String} options.auth.apiUrl API Url of the external authentication node
 * @param {String} options.auth.oauthToken The oauth token to be used for authentication
 * @param {String} options.auth.scope The scope for oauth
 * @param {String} options.authCallback Callback function to be executed once the token has been validated
 */
module.exports.setOptions = function (options) {
    reduxOptions = options;
    if (options.mongooseInstance) {
        Model = require('./model')(options.mongooseInstance)
    } else {
        Model = require('./model')(require('mongoose'))
    }

    if (options.authCallback && !_.isFunction(options.authCallback)) {
        throw new Error('Reduxpress - The Auth Callback param should be function which returns a promise resolving the user data.')
    }
};

/**
 *
 * @param request
 * @param response
 * @param next
 */
module.exports.mount = function (request, response, next) {
    if (!Model) {
        Model = require('./model')(require('mongoose'))
    }
    var model = new Model({
        method: request.method,
        route: request.protocol + '://' + request.get('host') + request.originalUrl,
        ipAddress: request.headers[reduxOptions.ipHeader] || request.ip,
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

/**
 * @description- Starts the internal cron jobs
 */
module.exports.startCronJobs = function () {
    Cron.run();
};

/**
 * @returns {Routes}
 */
module.exports.router = function () {
    return Routes;
};

/**
 *
 * @returns {Crud}
 */
module.exports.crud = function () {
    return ReduxCrud;
};

/**
 *
 * @param options
 */
module.exports.getTestDouble = function (options) {
    if (!Model) {
        Model = require('./model')(require('mongoose'))
    }
    var model = new Model({});

    return new Redux(model, options);
};

/**
 * @export Model
 * @description Exports the model object
 */
module.exports.schema = Model;


/**
 * @export logger
 * @description Exports the logger object
 */
module.exports.logger = Logger;
