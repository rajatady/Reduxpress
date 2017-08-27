/**
 * Created by kumardivyarajat on 16/08/16.
 */
var https = require('https');
var express = require('express');
var router = express.Router();
var forward, agent, tag;
var Promise = require("bluebird");
var msg91Err = require('./errorUtils');
var request = require('request');

module.exports.checkBalance = function (baseUrl, authKey, type, isLoggingEnabled) {

    //http://api.msg91.com/api/balance.php?authkey=YourAuthKey&type=1
    var urlFragment = "balance.php";
    var url = baseUrl;
    url += urlFragment;
    url += "?authkey=" + authKey;
    url += "&type=" + type;

    return new Promise(function (resolve, reject) {

        request.get(url, function (e, r, data) {
                if (e == null) {
                    data = JSON.parse(data);
                    if (data.msg) {
                        var er = new Error(data.msgType);
                        er.code = parseInt(data.msg);
                        msg91Err.prettyPrintError(er, isLoggingEnabled);
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


module.exports.changePassword = function (baseUrl, authKey, type, isLoggingEnabled) {

    //http://api.msg91.com/api/balance.php?authkey=YourAuthKey&type=1
    var urlFragment = "balance.php";
    var url = baseUrl;
    url += urlFragment;
    url += "?authkey=" + authKey;
    url += "&type=" + type;

    return new Promise(function (resolve, reject) {

        request.get(url, function (e, r, data) {
                if (e == null) {
                    data = JSON.parse(data);
                    if (data.msg) {
                        var er = new Error(data.msgType);
                        er.code = parseInt(data.msg);
                        msg91Err.prettyPrintError(er, isLoggingEnabled);
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

