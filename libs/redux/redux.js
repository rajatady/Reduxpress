var Promise = require('bluebird');
var _ = require('lodash');
var Logger = require("./libs/logger/index.js");
var Request = require("./libs/request/index");
var Utils = require("./libs/utils/index");
var Response = require("./libs/response/index");
var Auth = require("./libs/auth/index");
var Err = require("./libs/error/index");
var ipLocation = require('iplocation').default;

var Crud = require("./libs/crud/index");

/**
 * @default Default Options
 * @type {
 * {saveTrace: boolean, authCallback : function, mongooseInstance : Object, extendIpData: boolean, engine : String, auth: {external: boolean, apiUrl: string, oauthToken: string, scope: string}}}
 */
var defaultOptions = {
    saveTrace: true,
    extendIpData: false,
    engine: 'db',
    auth: {
        external: false,
        apiUrl: "",
        oauthToken: "",
        scope: ""
    }
};


/**
 * @class Redux
 * @param model
 * @param options
 * @constructor
 */
function Redux(model, options) {
    if (!options) {
        options = {};
    }
    this.options = _.merge(defaultOptions, options);
    this.model = model;
    this.logger = Logger;
    this.request = new Request();
    this.response = new Response();
    this.utils = Utils;
    this.auth = new Auth(options.secret || 'secret');
    this.error = Err;
    this.crud = Crud;
    this.startTime = new Date().getTime();
    this.endTime = "";
    this.allowedRoles = [];
    this._suppressAuthError = false;
    if (this.options.errors) {
        Err.injectError(this.options.errors);
    }
    this.hooks = {
        'preValidation': [],
        'postValidation': [],
        'preSendSuccess': [],
        'postSendSuccess': [],
        'preSendError': [],
        'postSendError': [],
        'preSave': []
    };
    this._parseFilters(this.options.filters || [])
}


/****************************** START OWN METHODS ******************************/

/**
 *
 * @param filters
 * @private
 */
Redux.prototype._parseFilters = function (filters) {
    var vm = this
    filters.forEach(function (filter) {
        filter.enabled = false
        vm.hooks[filter.hookName].push(filter)
    })
}


/**
 *
 * @param hookName {String} The name of the hook eg postValidation, preSendSuccess
 * @param [options]
 * @param {function} [options.dataToFn] The data to pass to the initial filter function
 * @param {function} [options.dataToPass] The data to resolve after the pipeline is complete
 * @return {Promise.map}
 * @private
 */
Redux.prototype._execHooks = function (hookName, options) {
    var vm = this
    return new Promise(function (resolve, reject) {
        Promise.map(vm.hooks[hookName], function (filter) {
            if (filter.enabled) {
                return new Promise(function (resolve, reject) {
                    if (vm.debug) {
                        Logger.console('Started execution filter with name : ' + filter.name)
                    }
                    // TODO  : Add waterfall execution for true data filtering pipeline creation
                    filter.executorFn((options && options.dataToFn) || vm, function (data) {
                        if (vm.debug) {
                            Logger.console('Done Executing filter with name : ' + filter.name, data)
                        }
                        resolve(data)
                    })
                })
            } else {
                return null;
            }
        })
            .then(function (data) {
                resolve((options && options.dataToPass) || data)
            })
            .catch(reject)
    })
};


/**
 * @method filter
 * @memberOf Redux
 * @param filterNameOrFunction
 * @param hookName
 * @return {Redux}
 */
Redux.prototype.filter = function (filterNameOrFunction, hookName) {
    var vm = this;
    if (!filterNameOrFunction) {
        throw new Error('A filter name or executor function is required to register a sync hook')
    } else if (_.isFunction(filterNameOrFunction)) {
        if (!hookName) {
            hookName = 'postValidation'
        }
        this.hooks[hookName].push({
            name: 'SYNC_HOOK',
            executorFn: filterNameOrFunction,
            hookName: hookName,
            enabled: true
        })
    } else {
        _.forOwn(this.hooks, function (val, key) {
            val.forEach(function (filter, index) {
                if (filter.name === filterNameOrFunction) {
                    vm.hooks[key][index].enabled = true
                }
            })
        })
    }
    return this
}


/***
 * @memberOf Redux
 * @description Prints the init message
 */
Redux.prototype.printInitMessage = function () {
    if (process.env.NODE_ENV !== "test")
        Logger.console("Tracer mounted to request - " + new Date(), this.model.toObject());
};


/********************************** END **********************************/


/****************************** START LOGGER ******************************/

/**
 * @memberOf Redux
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
/**
 * @memberOf Redux
 * @returns Utils
 */
Redux.prototype.utils = function () {
    return this.utils;
};

/**
 * @memberOf Redux
 * @param data
 */
Redux.prototype.idValidator = function (data) {
    return this.utils.validateId(data);
};
/********************************** END **********************************/


/****************************** START RESPONSE ******************************/

/**
 * @memberOf Redux
 * @returns Response
 */
Redux.prototype.response = function () {
    return this.response;
};


/**
 * @memberOf Redux
 * @param key
 * @param value
 * @returns {Redux}
 */
Redux.prototype.setExtra = function (key, value) {
    this.response.setExtra(key, value);
    return this;
};

/**
 * @memberOf Redux
 * @param response
 * @param data
 * @param key
 * @description Send back data to the client with the pre defined schema
 */
Redux.prototype.sendSuccess = function (response, data, key) {
    var vm = this;
    if (!key) {
        key = "data";
    }
    this._execHooks('preSendSuccess', {dataToPass: data, dataToFn: data})
        .then(function (result) {
            vm.response.success(response, data, key);
            return vm._execHooks('postSendSuccess', {dataToPass: data, dataToFn: data});
        })
        .then(function () {
            return vm._execHooks('preSave');
        })
        .then(function () {
            vm._saveTrace(true);
        })
};


/**
 * @memberOf Redux
 * @param response
 * @param data
 * @param status
 * @description Sends response as raw JSON passed as parameter to the client instead of enforcing a schema
 */
Redux.prototype.sendJSON = function (response, data, status) {
    this.response.raw(response, data, status);
    this._saveTrace(!(data instanceof Error));
};

/**
 * @memberOf Redux
 * @param response
 * @param data
 * @param message
 * @description Send back error to the client
 */
Redux.prototype.sendError = function (response, data, message) {
    this.err(data);
    this.response.error(response, data, message);
    this._saveTrace(false);
    this._executeOnErrorCallback(data);
};

var _save = function (that, resolved, ttr) {
    if (that.options.saveTrace) {
        that.logger.info("2. Now Saving response trace to DB ...");
        if (that.options.engine === 'db') {
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
                    that.logger.errorLine("3. Error while saving data ...");
                    that.err(err);
                    if (resolved) {
                        that.logger.info("4. Request served successfully - " + resolved + " in " + (ttr / 1000) + "s.");
                    } else {
                        that.logger.errorLine("4. Request served successfully - " + resolved + " in " + (ttr / 1000) + "s.");
                    }
                })
        } else if (that.options.engine === 'file') {
            var fs = require('fs');
            var pathData = require('path').resolve('./reduxFile.json');
            var data = '';
            try {
                data = fs.readFileSync(pathData);
            } catch (e) {
                data = '';
            }
            var now = new Date;
            that.model.createdAt = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
                now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
            if (data) {
                data = JSON.parse(data);
                if (!data.traces) {
                    data.traces = [];
                }
                data.traces.push(that.model);
            } else {
                data = {
                    traces: [that.model]
                }
            }
            fs.writeFileSync(pathData, JSON.stringify(data), 'utf-8');
            that.logger.info("3. Saved data to FILE - reduxFile.json ...");
            if (resolved) {
                that.logger.info("4. Request served successfully - " + resolved + " in " + (ttr / 1000) + "s.");
            } else {
                that.logger.errorLine("4. Request served successfully - " + resolved + " in " + (ttr / 1000) + "s.");
            }
        }
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
 * @description Save the trace
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
 * @description Suppress the fields from the response
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
 * @returns {Redux}
 */
Redux.prototype.attachData = function () {
    this.request._attachData(arguments);
    return this;
}

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
                if (findDataIn === 'body') {
                    return self.bodyValidator(request, params);
                } else if (findDataIn === "headers") {
                    return self.headersValidator(request, params);
                } else if (findDataIn === "params")
                    return self.paramsValidator(request, params);
                else if (findDataIn === "query")
                    return self.queryValidator(request, params);
            })
            .then(function (data) {
                resolve(data);
            })
            .catch(function (error) {
                reject(error);
            })
    });
};


/**
 * @memberOf Redux
 * @returns {boolean}
 * @private
 */
Redux.prototype._checkRolesValidity = function () {
    // console.log("_checkRolesValidity", this.allowedRoles, this.currentUser);
    return _.includes(this.allowedRoles, this.currentUser.role);
};

/**
 * @memberOf Redux
 * @param request
 * @param bodyData
 * @param params
 */
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


/**
 * @memberOf Redux
 * @param value
 * @param debug
 * @returns {Redux}
 */
Redux.prototype.invokeAcl = function (value, debug) {
    var that = this;
    // _.forEach(Array.prototype.slice.call(arguments[0]), function (value) {
    //     that.allowedRoles.push(value);
    // });
    that.allowedRoles = value.split(" ");
    // console.log("invokeAcl", that.allowedRoles);
    if (debug) {
        console.log('[REDUX DEBUG] : Allowed Rules - ' + that.allowedRoles);
    }

    return that;
};

/**
 * @memberOf Redux
 * @returns {Redux}
 */
Redux.prototype.suppressAuthError = function() {
    this._suppressAuthError = true;
    return this;
};

/**
 * @memberOf Redux
 * @param request
 * @param {String} [token] The token to validate against. By default reduxpress tries to find the token in headers
 * at x-access-token or as a query in url name access_token.
 */
Redux.prototype.tokenValidator = function (request, token) {
    var self = this;
    return new Promise(function (resolve, reject) {
        var accessToken = token || request.headers["x-access-token"] || request.query['access_token'];
        if (accessToken) {
            self.verifyToken(accessToken)
                .then(function (result) {
                    self.setCurrentUser(result);
                    if (self.allowedRoles.length > 0) {
                        var valid = self._checkRolesValidity();
                        if (!valid) {
                            throw self.generateError(403, "Unauthorized");
                        }
                    }
                    return self._execHooks('postValidation', {dataToPass: result})
                })
                .then(resolve)
                .catch(reject)
        } else {
            if(self._suppressAuthError) {
                resolve();
            } else {
                throw self.generateError(403, "Unauthorized");
            }
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
 * @memberOf Redux
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
    var that = this;
    if (typeof token === 'string') {
        return new Promise(function (resolve, reject) {
            var promise = '';
            if (that.options.auth.external) {
                promise = that.auth.validateExternalToken(token, that.options.auth);
            } else {
                promise = that.auth.validateToken(token, that._suppressAuthError);
            }
            promise
                .then(function (data) {
                    return that._executedAuthCallback(data);
                })
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                })
        });
    } else if (Utils.isObject(token)) {
        return new Promise(function (resolve, reject) {
            that.headersValidator(token, ["x-access-token"])
                .then(function (data) {
                    if (that.options.auth.external) {
                        return that.auth.validateExternalToken(token, that.options.auth);
                    } else {
                        return that.auth.validateToken(data["x-access-token"], that._suppressAuthError);
                    }
                })
                .then(function (data) {
                    return that._executedAuthCallback(data);
                })
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                })
        });

    }
};

Redux.prototype._executedAuthCallback = function (data) {
    if (this.options.authCallback && _.isFunction(this.options.authCallback)) {
        return this.options.authCallback(data);
    } else {
        return data;
    }
};


Redux.prototype._executeOnErrorCallback = function (error) {
    if (this.options.onError && _.isFunction(this.options.onError)) {
        return this.options.onError(error, this.model);
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
 * @memberOf Redux
 * @param code
 * @param message
 * @return {*}
 */
Redux.prototype.generateError = function (code, message) {
    return this.error.generateNewError(code, message);
};

/**
 * @memberOf Redux
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
 * @memberOf Redux
 * @param data
 * @return {Redux}
 */
Redux.prototype.setMetaData = function (data) {
    this.model.metaData = data;
    return this;
};


module.exports = Redux;
