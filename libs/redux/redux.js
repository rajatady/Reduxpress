/**
 * Created by kumardivyarajat on 23/09/16.
 */
var Promise = require('bluebird');
var _ = require('lodash');
var Logger = require("./libs/logger/index.js");
var Request = require("./libs/request/index");
var Utils = require("./libs/utils/index");
var Response = require("./libs/response/index");
var Auth = require("./libs/auth/index");
var Err = require("./libs/error/index");
var ipLocation = require('iplocation');

var Crud = require("./libs/crud/index");

/**
 *
 * @default Default Options
 * @type {{saveTrace: boolean, extendIpData: boolean, auth: {external: boolean, apiUrl: string, oauthToken: string, scope: string}}}
 */
var defaultOptions = {
    saveTrace: true,
    extendIpData: false,
    auth: {
        external: false,
        apiUrl: "",
        oauthToken: "",
        scope: ""
    }
};

/**
 * @memberOf request
 * @param model
 * @param options
 * @constructor
 */
function Redux(model, options) {
    this.options = options || defaultOptions;
    this.model = model;
    this.logger = Logger;
    this.request = Request;
    this.response = new Response();
    this.utils = Utils;
    this.auth = new Auth(options.secret || 'secret');
    this.error = Err;
    this.crud = Crud;
    this.startTime = new Date().getTime();
    this.endTime = "";
    this.allowedRoles = [];
    if (this.options.errors) {
        Err.injectError(this.options.errors);
    }
}


/****************************** START OWN METHODS ******************************/


/***
 * @description Prints the init message
 * @memberOf Redux
 */
Redux.prototype.printInitMessage = function () {
    if (process.env.NODE_ENV !== "test")
        Logger.console("Tracer mounted to request - " + new Date(), this.model.toObject());
};


/********************************** END **********************************/


/****************************** START LOGGER ******************************/

/**
 *
 * @return {Redux.logger|*}
 */
Redux.prototype.logger = function () {
    return this.logger;
};


/**
 * @memberOf Redux
 */
Redux.prototype.printTrace = function () {
    Logger.console("Redux Tracer", this.model.trace);
};

/**
 * @memberOf Redux
 * @param data
 * @param title
 */
Redux.prototype.log = function (data, title) {
    if (!title) {
        title = "Logger";
    }
    if (!data) {
        Logger.info(title + " ---  xxx  ---  Undefined object sent to log .");
        this.model.trace.push(data);
    } else {
        if (data.validate) {
            //noinspection JSDuplicatedDeclaration
            var object = data.toObject();
            Logger.console(title, object);
            this.model.trace.push(object);
        } else {
            Logger.console(title, data);
            if (Utils.isArray(data)) {
                var a = {};
                a[title] = data.length;
                this.model.trace.push(a);
            } else {
                this.model.trace.push(data);
            }

        }
    }


};

/**
 * @memberOf Redux
 * @param data
 */
Redux.prototype.err = function (data) {
    if (data instanceof Error) {
        var error = {
            stack: data.stack,
            message: data.message,
            code: data.code
        };
        this.model.trace.push(error);
    } else {
        this.model.trace.push(data);
    }
};

/********************************** END **********************************/


/****************************** START REQUEST ******************************/


Redux.prototype.request = function () {
    return this.request;
};

/**
 * @memberOf Redux
 * @returns {Redux}
 */
Redux.prototype.suppressInput = function () {
    this.request._suppressInputs(arguments);
    return this;
};

/***
 *
 * @memberOf Redux
 * @param request
 * @param params
 * @param inBody
 *
 */
Redux.prototype.requestValidator = function (request, params, inBody) {
    return this.request._validateRequest(request, params, inBody);
};

/***
 * @memberOf Redux
 * @param request
 * @param params
 */
Redux.prototype.headersValidator = function (request, params) {
    return this.request._validateHeaders(request, params);
};

/**
 * @memberOf Redux
 * @param request
 * @param params
 */
Redux.prototype.paramsValidator = function (request, params) {
    return this.request._validateParams(request, params);
};

/**
 * @memberOf Redux
 * @param request
 * @param params
 */
Redux.prototype.bodyValidator = function (request, params) {
    return this.request._validateBody(request, params);
};

/**
 * @memberOf Redux
 * @param request
 * @param params
 */
Redux.prototype.queryValidator = function (request, params) {
    return this.request._validateQuery(request, params);
};

// /**
//  * @param request
//  */
// Redux.prototype.queryValidator = function (request) {
//     var self = this;
//     return new Promise(function (resolve, reject) {
//         var query = request.query;
//         if (!Object.keys(query).length)
//             reject(self.generateError(301));
//         else
//             resolve(query);
//     });
// };

Redux.prototype.objectValidator = function (request, objectName, keys) {

};
/********************************** END **********************************/

/****************************** START UTILS ******************************/

Redux.prototype.utils = function () {
    return this.utils;
};

Redux.prototype.idValidator = function (data) {
    return this.utils.validateId(data);
};
/********************************** END **********************************/


/****************************** START RESPONSE ******************************/

Redux.prototype.response = function () {
    return this.response;
};


Redux.prototype.setExtra = function (key, value) {
    this.response.setExtra(key, value);
    return this;
};

/**
 * @memberOf Redux
 * @param response
 * @param data
 * @param key
 */
Redux.prototype.sendSuccess = function (response, data, key) {
    if (!key) {
        key = "data";
    }
    this.response.success(response, data, key);
    this._saveTrace(true);
};

/**
 * @memberOf Redux
 * @param response
 * @param data
 * @param message
 */
Redux.prototype.sendError = function (response, data, message) {
    this.err(data);
    this.response.error(response, data, message);
    this._saveTrace(false);
    var self = this;
    // BugsSnag.onBeforeNotify(function (notification) {
    //     var metaData = notification.events[0].metaData;
    //     // console.log(notification);
    //     var event = notification.events[0];
    //     // modify meta-data
    //     if (Array.isArray(data.message)) {
    //         metaData.error = data.message.map(r => r.error + ", ");
    //     } else {
    //         metaData.error = data.message;
    //     }
    //     if (self.currentUser) {
    //         event.user = {
    //             id: self.currentUser._id,
    //             name: self.currentUser.name,
    //             email: self.currentUser.email,
    //             mobile: self.currentUser.mobile,
    //             role: self.currentUser.role
    //         };
    //     }
    //     metaData.trace = data.stack;
    //     event.releaseStage = ENV;
    // });
    // BugsSnag.notify(data);
};

var _save = function (that, resolved, ttr) {
    if (that.options.saveTrace) {
        that.logger.info("2. Now Saving response trace to DB ...");
        that.model.save()
            .then(function (model) {
                that.logger.info("3. Saved data to DB ...");
                if (resolved) {
                    that.logger.info("4. Request served successfully - " + resolved + " in " + (ttr / 1000) + "s.");
                } else {
                    that.logger.errorLine("4. Request served successfully - " + resolved + " in " + (ttr / 1000) + "s.");
                }
            })
            .catch(function (err) {
                console.log(err);
                that.logger.errorLine("3. Error while saving data ...");
                that.err(err);
                if (resolved) {
                    that.logger.info("4. Request served successfully - " + resolved + " in " + (ttr / 1000) + "s.");
                } else {
                    that.logger.errorLine("4. Request served successfully - " + resolved + " in " + (ttr / 1000) + "s.");
                }
            })
    } else {
        if (resolved) {
            that.logger.info("2. Request served successfully - " + resolved + " in " + (ttr / 1000) + "s.");
        } else {
            that.logger.errorLine("2. Request served successfully - " + resolved + " in " + (ttr / 1000) + "s.");
        }
    }
};
/**
 *
 * @param resolved
 * @private
 */
Redux.prototype._saveTrace = function (resolved) {
    var that = this;
    var endTime;
    var ttr;
    if (process.env.NODE_ENV !== "test") {
        setTimeout(function () {
            that.logger.info("1. Response sent to the agent..");
            endTime = new Date().getTime();
            ttr = that.model.ttr = endTime - that.startTime;
            that.model.resolved = resolved;
            if (that.options.extendIpData) {
                that.logger.info("Finding IP Details..");
                ipLocation(that.model.ipAddress)
                    .then(function (res) {
                        that.model.ipDetails = res;
                        that.logger.info("IP details found !");
                        // Logger.console('IP Address - ' + that.model.ipAddress, res);
                        _save(that, resolved, ttr);
                    })
                    .catch(function (err) {
                        that.logger.error(err, 'Error while fetching IP Data for Address - ' + that.model.ipAddress);
                        _save(that, resolved, ttr);
                    })
            } else {
                _save(that, resolved, ttr);
            }
        }, 0);
    }
};

/***
 * @memberOf Redux
 */
Redux.prototype.suppress = function () {
    this.response.suppressFields(arguments);
    return this;
};


/********************************** END **********************************/


/**
 * @memberOf Redux
 * @returns {exports.auth|*}
 */
Redux.prototype.auth = function () {
    return this.auth;
};


/**
 * @memberOf Redux
 * @param request
 * @param params
 * @param findDataIn
 */
Redux.prototype.interceptor = function (request, params, findDataIn) {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.tokenValidator(request)
            .then(function () {
                if (self.allowedRoles.length > 0) {
                    if (!self._checkRolesValidity()) {
                        throw self.generateError(403, "Unauthorized");
                    }
                }
                if (findDataIn == 'body')
                    return self.bodyValidator(request, params);
                else if (findDataIn == "headers") {
                    return self.headersValidator(request, params);
                }
                else if (findDataIn == "params")
                    return self.paramsValidator(request, params);
            })
            .then(function (data) {
                resolve(data);
            })
            .catch(function (error) {
                reject(error);
            })
    });
};

Redux.prototype._checkRolesValidity = function () {
    // console.log("_checkRolesValidity", this.allowedRoles, this.currentUser);
    return _.includes(this.allowedRoles, this.currentUser.role);
};

Redux.prototype.putInterceptor = function (request, bodyData, params) {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.tokenValidator(request)
            .then(function () {
                return Promise.all([
                    self.paramsValidator(request, params),
                    self.bodyValidator(request, bodyData)
                ])
            })
            .then(function (result) {
                resolve(result);
            })
            .catch(function (error) {
                reject(error);
            })
    });
};

Redux.prototype.invokeAcl = function (value) {
    var that = this;
    // _.forEach(Array.prototype.slice.call(arguments[0]), function (value) {
    //     that.allowedRoles.push(value);
    // });
    that.allowedRoles = value.split(" ");
    // console.log("invokeAcl", that.allowedRoles);
    return that;
};


/**
 * @param request
 */
Redux.prototype.tokenValidator = function (request) {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (request.headers["x-access-token"]) {
            self.headersValidator(request, ["x-access-token"])
                .then(function (data) {
                    return self.verifyToken(data['x-access-token']);
                })
                .then(function (result) {
                    self.currentUser = result;
                    if (self.allowedRoles.length > 0) {
                        var valid = self._checkRolesValidity();
                        if (!valid) {
                            throw self.generateError(403, "Unauthorized");
                        }
                    }
                    resolve(result);
                })
                .catch(function (error) {
                    reject(error);
                })
        } else if (request.query['access_token']) {
            self.queryValidator(request, ['access_token'])
                .then(function (data) {
                    return self.verifyToken(data['access_token']);
                })
                .then(function (result) {
                    self.currentUser = result;
                    if (self.allowedRoles.length > 0) {
                        var valid = self._checkRolesValidity();
                        if (!valid) {
                            throw self.generateError(403, "Unauthorized");
                        }
                    }
                    resolve(result);
                })
                .catch(function (error) {
                    reject(error);
                })
        } else {
            throw self.generateError(403, "Unauthorized");
        }
    });
};

/**
 * @memberOf Redux
 * @param user
 */
Redux.prototype.setCurrentUser = function (user) {
    this.currentUser = user;
    this.model.user = user;
    this.model.userId = user._id || user.id;
};

/**
 * @memberOf Redux
 * @param tags
 */
Redux.prototype.addTag = function (tags) {
    if (_.isArray(tags)) {
        this.model.tags = this.model.tags.concat(tags);
    } else if (_.isString(tags)) {
        this.model.tags.push(tags);
    }
};

/**
 *
 * @param data
 */
Redux.prototype.saveAuthDetails = function (data) {
    this.model.accessToken = data.x_access_token;
    this.model.refreshToken = data.x_refresh_token;
    this.model.accessTokenHash = data.secret;
};
/**
 * @memberOf Redux
 * @param token
 * @returns {Promise}
 */
Redux.prototype.verifyToken = function (token) {
    if (typeof token === 'string') {
        if (this.options.auth.external) {
            return this.auth.validateExternalToken(token, this.options.auth);
        } else {
            return this.auth.validateToken(token);
        }
    } else if (Utils.isObject(token)) {
        var that = this;
        this.headersValidator(token, ["x-access-token"])
            .then(function (data) {
                if (that.options.auth.external) {
                    return that.auth.validateExternalToken(token, that.options.auth);
                } else {
                    return that.auth.validateToken(data["x-access-token"]);
                }
            })
            .catch(function (err) {
                throw err;
            })
    }
};

/**
 * @memberOf Redux
 * @param user
 * @param accessTokenTime
 * @param refreshTokenTime
 * @param unit
 * @returns {Promise}
 */
Redux.prototype.generateToken = function (user, accessTokenTime, refreshTokenTime, unit) {
    return this.auth.generateToken(user, accessTokenTime, refreshTokenTime, unit);
};


/**
 * @memberOf Redux
 * @param secret
 * @param options
 * @returns {Promise}
 */
Redux.prototype.generateOTP = function (secret, options) {
    return this.auth.generateOTP(secret, options);
};

/**
 * @memberOf Redux
 * @param secret
 * @param OTP
 * @param options
 * @returns {Promise}
 */
Redux.prototype.verifyOTP = function (secret, OTP, options) {
    return this.auth.verifyOTP(secret, OTP, options);
};

/**
 *
 * @param code
 * @param message
 * @return {*}
 */
Redux.prototype.generateError = function (code, message) {
    return this.error.generateNewError(code, message);
};

/**
 *
 * @param mobile
 * @param message
 * @return {bluebird}
 */
Redux.prototype.sendSingleSMS = function (mobile, message) {
    return new Promise(function (resolve, reject) {
        msg91.send({mobiles: mobile, message: message})
            .then(function (result) {
                result.senderId = msg91.getSenderId();
                resolve(result)
            })
            .catch(function (error) {
                reject(error);
            })

    })
};

/**
 *
 * @param data
 * @return {Redux}
 */
Redux.prototype.setMetaData = function (data) {
    this.model.metaData = data;
    return this;
};


module.exports = Redux;
