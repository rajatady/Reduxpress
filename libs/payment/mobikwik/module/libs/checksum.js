"use strict";

var crypt = require('./crypt');
var util = require('util');
var crypto = require('crypto');


var fieldsPriority = [
    "cell", "email", "amount", "orderid", "redirecturl", "mid"
];

var responseFieldsPriority = [
    "statuscode", "orderid", "amount", "statusmessage", "mid"
];

//mandatory flag: when it set, only mandatory parameters are added to checksum

function paramsToString(params, mandatoryflag) {
    var data = "";
    var flag = params.refund ? true : false;
    delete params.refund;
    delete params._merchantKey;
    delete params._loggingEnabled;

    if (mandatoryflag) {
        fieldsPriority.forEach(function (key, i) {
            console.log(key);
            if (key !== 'checksum') {
                if (params[key] === 'null') params[key] = '';
                data += "'" + (params[key] + "'");
            }
        });
    } else {
        // if (!flag) tempKeys.sort();
        responseFieldsPriority.forEach(function (key, i) {
            console.log(key);
            if (key !== 'checksum') {
                if (params[key] === 'null') params[key] = '';
                data += "'" + (params[key] + "'");

            }
        });
    }

    return data;
}


function genchecksum(params, key, cb) {
    var data = paramsToString(params, true);
    var secret = key; //make this your secret!!
    var algorithm = 'sha256';   //consider using sha256
    var hash, hmac;


    console.log("Key", key);
    console.log("data", data);
    hmac = crypto.createHmac(algorithm, secret);
    hmac.update(data);
    hash = hmac.digest('hex');
    console.log("Method 2: ", hash);
    params.checksum = hash;
    cb(undefined, params);

    // console.log("From Checksum", data, "\nkey", key);
    //
    // crypt.gen_salt(4, function (err, salt) {
    //     var sha256 = crypto.createHash('sha256').update(data + salt).digest('hex');
    //     var check_sum = sha256 + salt;
    //     var encrypted = crypt.encrypt(check_sum, key);
    //     if (flag) {
    //         params.checksum = encodeURIComponent(encrypted);
    //         params.checksum = encrypted;
    //     } else {
    //         params.checksum = encodeURIComponent(encrypted);
    //         params.checksum = encrypted;
    //     }
    //     cb(undefined, params);
    // });
}

var trimFrontSlash = function (string) {
    return string.replace("_", "");
};

function genchecksumbystring(params, key, cb) {

    crypt.gen_salt(4, function (err, salt) {
        var sha256 = crypto.createHash('sha256').update(params + '|' + salt).digest('hex');
        var check_sum = sha256 + salt;
        var encrypted = crypt.encrypt(check_sum, key);

        var CHECKSUMHASH = encodeURIComponent(encrypted);
        CHECKSUMHASH = encrypted;
        cb(undefined, CHECKSUMHASH);
    });
}

function verifychecksum(params, key) {
    var data = paramsToString(params, false);
    //TODO: after PG fix on thier side remove below two lines
    if (params.checksum) {
        var secret = key; //make this your secret!!
        var algorithm = 'sha256';   //consider using sha256
        var hash, hmac;
        console.log("Key", key);
        console.log("data", data);
        hmac = crypto.createHmac(algorithm, secret);
        hmac.update(data);
        hash = hmac.digest('hex');
        console.log("Hash", secret, hash, params.checksum);
        if (hash === params.checksum) {
            return true;
        } else {
            util.log("checksum is wrong");
            return false;
        }
    } else {
        util.log("checksum not found");
        return false;
    }
}

function verifychecksumbystring(params, key, checksumhash) {

    var checksum = crypt.decrypt(checksumhash, key);
    var salt = checksum.substr(checksum.length - 4);
    var sha256 = checksum.substr(0, checksum.length - 4);
    var hash = crypto.createHash('sha256').update(params + '|' + salt).digest('hex');
    if (hash === sha256) {
        return true;
    } else {
        util.log("checksum is wrong");
        return false;
    }
}


module.exports.genchecksum = genchecksum;
module.exports.verifychecksum = verifychecksum;
module.exports.verifychecksumbystring = verifychecksumbystring;
module.exports.genchecksumbystring = genchecksumbystring;