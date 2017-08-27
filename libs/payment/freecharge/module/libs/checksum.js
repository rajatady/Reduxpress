"use strict";

var crypt = require('./crypt');
var util = require('util');
var crypto = require('crypto');

//mandatory flag: when it set, only mandatory parameters are added to checksum

function paramsToString(params, mandatoryflag) {
    var data = {};
    var flag = params.refund ? true : false;
    delete params.refund;
    delete params._merchantKey;
    delete params._loggingEnabled;
    var tempKeys = Object.keys(params);
    if (!flag) tempKeys.sort();
    tempKeys.forEach(function (key) {
        if (key !== 'checksum') {
            if (key === "amount")
                if(typeof params[key] !== "string")
                    data[key] = params[key].toFixed(2).toString();
                else
                    data[key] = parseInt(params[key]).toFixed(2).toString();
            else
                data[key] = params[key];
        }
    });
    return data;
}


function genchecksum(params, key, cb) {
    var data = JSON.stringify(paramsToString(params));
    data += key + "\"}";
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
    //TODO: after PG fix on thier side remove below two lines
    if (params.checksum) {
        var data = JSON.stringify(paramsToString(params));
        data += key + "\"}";
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

// function verifychecksum(params, key) {
//     var data = paramsToString(params, false);
//     //TODO: after PG fix on thier side remove below two lines
//     if (params.checksum) {
//         params.checksum = params.checksum.replace('\n', '');
//         params.checksum = params.checksum.replace('\r', '');
//
//         console.log("1. Checksum = ", params.checksum);
//         var temp = decodeURIComponent(params.checksum);
//         console.log("2. Temp = ", temp);
//         var checksum = crypt.decrypt(temp, key);
//         console.log("3. Checksum = ", checksum);
//         var salt = checksum.substr(checksum.length - 4);
//         console.log("4. Salt = ", salt);
//         var sha256 = checksum.substr(0, checksum.length - 4);
//         console.log("5. Sha256 = ", sha256);
//         var hash = crypto.createHash('sha256').update(data + salt).digest('hex');
//         console.log("6. Hash = ", hash);
//         console.log("verifychecksum", hash);
//         if (hash === sha256) {
//             return true;
//         } else {
//             util.log("checksum is wrong");
//             return false;
//         }
//     } else {
//         util.log("checksum not found");
//         return false;
//     }
// }

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