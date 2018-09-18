/**
 * Created by kumardivyarajat on 23/09/16.
 */
var Logger = require("../logger/index");
var _ = require("lodash");
var mongoose = require("mongoose");
var utils = require("../utils/index");

function Request() {
    this._suppressParams = [];
    this._roles = [];
}

/**
 *
 * @returns {Request}
 * @private
 */
Request.prototype._suppressInputs = function () {
    var that = this;
    _.forEach(Array.prototype.slice.call(arguments[0]), function (value) {
        that._suppressParams.push(value);
    });
    console.log(that._suppressParams.length);
};


/***
 * @memberOf Request#
 * @param request
 * @param params
 * @param inBody
 * @returns {Promise}
 */
Request.prototype._validateRequest = function (request, params, inBody) {
    if (Array.isArray(params)) {
        return this._validateSimpleModel(request, params, inBody);
    } else if (utils.isObject(params)) {
        return this._validateObjectModel(request, params, inBody);
    }
};


Request.prototype._validateHeaders = function (request, params) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that._validate(params, request, "headers")
            .then(function (data) {
                resolve(data);
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

Request.prototype._validateParams = function (request, params) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that._validate(params, request, "params")
            .then(function (data) {
                resolve(data);
            })
            .catch(function (err) {
                reject(err);
            })
    });
};


Request.prototype._validateQuery = function (request, params) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that._validate(params, request, "query")
            .then(function (data) {
                resolve(data);
            })
            .catch(function (err) {
                reject(err);
            })
    });
};

Request.prototype._validateBody = function (request, params) {
    var that = this;
    if (Array.isArray(params)) {
        return that._validateSimpleModel(request, params, "body");
    } else if (utils.isObject(params)) {
        return that._validateObjectModel(request, params, "body");
    }
};


Request.prototype._validateSimpleModel = function (request, params, inBody) {
    var that = this;
    return new Promise(function (resolve, reject) {
        var where = "";
        if (inBody) {
            where = "body";
        } else {
            where = "headers";
        }
        that._validate(params, request, where)
            .then(function (data) {
                resolve(data);
            })
            .catch(function (err) {
                reject(err);
            })
    });
};


Request.prototype._validateObjectModel = function (request, object, inBody) {
    var that = this;
    var params = [];
    var where = "";

    return new Promise(function (resolve, reject) {
        if (object.schema) {
            if (inBody) {
                where = "body";
            } else {
                where = "headers";
            }
            that._validateMongooseSchema(object, request, where)
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                })
        } else {
            console.log("Schema Less");
            if (inBody) {
                where = "body";
            } else {
                where = "headers";
            }

            _.forOwn(object, function (i, k) {
                params.push(k);
            });

            that._validate(params, request, where)
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                })
        }
    });
};

Request.prototype._validateMongooseSchema = function (Schema, request, where) {
    var that = this;
    return new Promise(function (resolve, reject) {
        var errorMessages = [];
        if (that._suppressParams.length > 0) {
            _.forEach(that._suppressParams, function (value) {
                if (_.hasIn(request[where], value)) {
                    var err = new Error();
                    err.message = "Invalid Params";
                    err.code = 100;
                    throw err;
                }
            });
        }
        var model = new Schema(request[where]);
        var error = model.validateSync();
        if (error) {
            _.forEach(error.errors, function (err) {
                if (err.message) {
                    errorMessages.push({error: err.message});
                } else {
                    errorMessages.push({error: "Required param " + err.path + " is missing."})
                }
            });
            var err = new Error();
            err.message = errorMessages;
            err.code = 409;
            reject(err);
        } else {
            resolve(model);
        }
    });
};


Request.prototype._validate = function (params, request, where) {
    return new Promise(function (resolve, reject) {

        var errMsgs = [];
        var data = {};
        var hasError = false;
        _.forEach(params, function (param) {
            if (param.indexOf("^") === -1 &&
                (typeof request[where][param] === 'undefined' ||
                request[where][param] === null ||
                request[where][param] === '')) {
                errMsgs.push({error: "Required param " + param + " is missing."});
                hasError = true;
            } else {
                param = param.replace("^", "");
                if (typeof request[where][param] !== "undefined" &&
                    request[where][param] !== null &&
                    request[where][param] !== '') {
                    data[param] = request[where][param];
                } else {
                    errMsgs.push({error: "Required param " + param + " is missing."});
                    hasError = true;
                }
            }

        });
        if (hasError) {
            var err = new Error();
            err.message = errMsgs;
            err.code = 409;
            reject(err);
        } else {
            resolve(data);
        }
    });
};

module.exports = new Request();
