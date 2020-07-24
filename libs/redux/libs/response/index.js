/**
 * Created by kumardivyarajat on 23/06/16.
 */

var utils = require("../utils/index");
var _ = require("lodash");
var Logger = require("../logger/index.js");
var ReduxError = require("../error/index");

function Response() {
    this._suppressParams = [];
    this._extras = [];
}

/**
 *
 * @returns {Response}
 * @description Suppresses a field in the data. Accepts more than one parameters.
 * Also supports nested fields.
 *
 *
 */
Response.prototype.suppressFields = function () {
    this._suppressParams = Array.prototype.slice.call(arguments);
    console.log("Fields", this._suppressParams);
    return this;
};


/***
 *
 * @param key
 * @param value
 * @returns {Response}
 */
Response.prototype.setExtra = function (key, value) {
    var obj = {};
    obj[key] = value;
    this._extras.push(obj);
};

/**
 * @param response
 * @param data
 * @param key
 * @returns {*}
 */
Response.prototype.success = function (response, data, key) {
    var builderData = {
        status: "success",
        code: 200
    };
    if (this._suppressParams.length > 0) {
        data = this._suppress(data);
    }

    if (this._extras.length > 0) {
        this._extras.forEach(function (o, i) {
            builderData = utils.merge_options(builderData, o);
        });
    }
    if (utils.isArray(data)) {
        builderData = this._buildArray(builderData, data, key);
    } else if (utils.isObject(data)) {
        builderData = this._buildObject(builderData, data, key);
    } else {
        builderData.message = {};
        builderData.message[key] = data;
    }
    return response.json(builderData);
};

/**
 * @param response
 * @param data
 * @param status
 * @returns {*}
 */
Response.prototype.raw = function (response, data, status) {
    return response.status(status || 200).json(data);
};

/**
 *
 * @param response
 * @param error
 * @param message
 * @returns {*}
 */
Response.prototype.error = function (response, error, message) {
    var err;
    if (error instanceof Error) {
        err = error;
        if (!err.code) {
            err.code = 500;
        }
    } else {
        err = ReduxError.generateNewError(error.code, error.message || message);
    }
    var builderData = {
        status: "failure",
        code: err.code,
        message: {error: err.message}
    };
    response.json(builderData);
    return err;
};

/**
 *
 * @param data
 * @param message
 * @param key
 * @returns {*}
 * @private
 */
Response.prototype._buildArray = function (data, message, key) {
    data.count = message.length;
    data.message = {};
    data.message[key] = message;
    return data;
};

/**
 *
 * @param data
 * @param message
 * @param key
 * @returns {*}
 * @private
 */
Response.prototype._buildObject = function (data, message, key) {
    data.message = {};
    data.message[key] = [message];
    return data;
};


Response.prototype._suppress = function (bcData) {
    bcData = bcData.toObject();
    var that = this;
    _.forOwn(bcData, function (value, key) {
        _.forEach(that._suppressParams, function (param, i) {
            console.log("Param -> ", param[i]);

            if (param[i] == key) {
                Logger.info("Found key, deleting field now " + key + " now.");
                delete bcData[key];
            }
        })
    });
    // _.omit(bcData, function (value, key) {
    //     console.log(value + " " + key);
    //     return key == "password";
    // });

    return bcData;
};


// /**
//  * @ngdoc overview
//  * @name AUTO
//  * @description
//  *
//  * Implicit module which gets automatically added to each {@link AUTO.$injector $injector}.
//  */
//
// var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
// var FN_ARG_SPLIT = /,/;
// var FN_ARG = /^\s*(_?)(.+?)\1\s*$/;
// var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
// function annotate(fn) {
//     var $inject,
//         fnText,
//         argDecl,
//         last;
//
//     if (typeof fn == 'function') {
//         if (!($inject = fn.$inject)) {
//             $inject = [];
//             fnText = fn.toString().replace(STRIP_COMMENTS, '');
//             argDecl = fnText.match(FN_ARGS);
//             forEach(argDecl[1].split(FN_ARG_SPLIT), function (arg) {
//                 arg.replace(FN_ARG, function (all, underscore, name) {
//                     $inject.push(name);
//                 });
//             });
//             fn.$inject = $inject;
//         }
//     } else if (isArray(fn)) {
//         last = fn.length - 1;
//         assertArgFn(fn[last], 'fn')
//         $inject = fn.slice(0, last);
//     } else {
//         assertArgFn(fn, 'fn', true);
//     }
//     return $inject;
// }


module.exports = Response;


