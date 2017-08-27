/**
 * Created by kumardivyarajat on 16/08/16.
 */

'use strict';
var https = require('https');
var forward, agent, tag;
var Promise = require("bluebird");
var msg91Err = require('./errorUtils');
var request = require('request');
var balance = require('./basic');
var _ = require('lodash');
var async = require("async");

module.exports = Msg91;

function Msg91(opt, smsModule) {
    if (!(this instanceof Msg91)) {
        return new Msg91(opt);
    }
    opt = opt || {};

    if (!(opt.sender)) {
        throw new Error('Sender ID is required');
    }

    if (!(opt.authKey)) {
        throw new Error('Auth Key is required');
    }

    if (!(opt.route)) {
        throw new Error('Route is required');
    }

    if (!(opt.logging)) {
        opt.logging = false;
    }

    this._setDefaultsOptions(opt);

    this.smsModule = smsModule;
}


Msg91.prototype._fragments = {
    balance: "balance.php",
    password: "password.php",
    validation: 'validate.php',
    send: "sendhttp.php"
};


Msg91.prototype._setDefaultsOptions = function (opt) {
    this._url = "https://api.msg91.com/api/";
    this._sender = opt.sender;
    this._authKey = opt.authKey;
    this._route = opt.route;
    this._loggingEnabled = opt.logging;
};

Msg91.prototype.getSenderId = function () {
    return this._sender;
};

Msg91.prototype.checkBalance = function () {
    return balance.checkBalance(this._url, this._authKey, this._route, this._loggingEnabled);
};

Msg91.prototype.send = function (queryParams) {
    queryParams.response = "json";
    var url = this._generateUrl(this._fragments.send, queryParams);
    console.log(url);
    return this._request(url);
};


Msg91.prototype.multiple = function (queryParams) {
    console.log(queryParams.mobiles);
    queryParams = this._parseMobileNumbers(queryParams);
    queryParams.response = "json";
    console.log(queryParams.mobiles);
    var url = this._generateUrl(this._fragments.send, queryParams);
    console.log(url);
    return this._request(url);
};


Msg91.prototype.forAllIn = function (array, field, queryParams) {
    queryParams.mobiles = this._getMobileNumberArray(array, field);
    this.multiple(queryParams);
};

Msg91.prototype.forEachIn = function (array, field, delimeterField, message, delimeter, queryParams) {
    var that = this;
    return new Promise(function (resolve, reject) {

    });
};


Msg91.prototype.enablePushRoute = function (expressApp) {
    var self = this;
    expressApp.post("/api/v1/msg91/receive", function (request, response) {
        self.smsModule.handlePushResponse(request);
    });
};

Msg91.prototype._runWithEach = function () {


};


Msg91.prototype._runInParallel = function (tasks, limit) {

    return new Promise(function (resolve, reject) {
        async.each(
            tasks,
            limit,
            function (err, results) {
                if (err) {
                    reject(err);
                }
                console.log(results);
                resolve(results);
            });
    });

};

Msg91.prototype._getMobileNumberArray = function (array, field) {
    var mobiles = [];
    console.log(array, field);
    _.forEach(array, function (value, key) {
        if (value[field]) {
            mobiles.push(value[field]);
        }
    });
    return mobiles;
};


Msg91.prototype._parseMobileNumbers = function (queryParams) {
    _.forOwn(queryParams, function (value, key) {
        if (key === "mobiles") {
            queryParams.mobiles = _.join(value, ",");
        }
    });
    return queryParams;
};


Msg91.prototype._request = function (url) {
    var that = this;
    return new Promise(function (resolve, reject) {
        request.get(url, function (e, r, data) {
                if (e == null) {
                    console.log(data);
                    data = JSON.parse(data);
                    if (data.msg) {
                        var er = new Error(data.msgType);
                        er.code = parseInt(data.msg);
                        msg91Err.prettyPrintError(er, that._loggingEnabled);
                        reject(er);
                    } else {
                        resolve({data: data});
                    }
                } else {
                    reject(e);
                }
            }
        );
    });
};


Msg91.prototype._generateUrl = function (fragmentUrl, queryParams) {
    var url = this._url;
    url += fragmentUrl;
    url += "?authkey=" + this._authKey;
    url += "&sender=" + this._sender;
    url += "&route=" + this._route;
    _.forOwn(queryParams, function (value, key) {
        url += "&" + key + "=" + value;
    });

    return encodeURI(url);
};


//
// //http://api.msg91.com/api/sendhttp.php?authkey=YourAuthKey&mobiles=919999999990,919999999999&message=message&sender=senderid&route=4&country=0
// var urlFragment = "sendhttp.php";
// var url = baseUrl;
// url += urlFragment;
// url += "?authkey=" + authKey;
// url += "?type=" + type;
// url += "&response=json";