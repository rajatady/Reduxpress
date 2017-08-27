/**
 * Created by Mir Rayees on 23/09/16.
 */
var JWT = require("jsonwebtoken");
var AuthCron = require('./cron');
var speakEasy = require('speakeasy');

var ErrorUtils = require("../error/index");
/**
 * @memberOf Auth#
 * @constructor
 */
function Auth() {
}

/**
 * @memberOf Auth#
 * @param token
 * @returns {Promise}
 */

Auth.prototype.validateToken = function (token) {
    return new Promise(function (resolve, reject) {
        AuthCron.secret()
            .then(function (secret) {
                console.log(secret);
                JWT.verify(token, secret, function (error, decoded) {
                    if (error) {
                        reject(ErrorUtils.generateNewError(413));
                    }
                    else {
                        var dataToReturn = {};
                        dataToReturn = decoded.user;
                        if (!dataToReturn) {
                            dataToReturn = decoded._doc;
                        }
                        resolve(dataToReturn);
                    }
                })
            })
            .catch(function (err) {
                reject(err)
            });
    })
};

/**
 * @memberOf Auth#
 * @param user
 * @param accessTokenTime
 * @param refreshTokenTime
 * @param unit
 * @returns {Promise}
 */
Auth.prototype.generateToken = function (user, accessTokenTime, refreshTokenTime, unit) {
    var TimeUnits = {
        "seconds": 's',
        "minutes": 'm',
        "hours": "h",
        "days": "d"
    };
    return new Promise(function (resolve, reject) {
        AuthCron.secret()
            .then(function (secret) {
                console.log(secret);
                var tokens = {};
                if (!(unit in TimeUnits))
                    reject(ErrorUtils.generateNewError(500, "Invalid Time Units"));
                var accessTime = accessTokenTime + TimeUnits[unit].toUpperCase();
                var refreshTime = refreshTokenTime + TimeUnits[unit].toUpperCase();
                tokens.x_access_token = JWT.sign(user, secret, {expiresIn: accessTime});
                tokens.x_refresh_token = JWT.sign(user, secret.substr(0, secret.length / 2), {expiresIn: refreshTime});
                tokens.secret = secret;
                if (secret && tokens.x_access_token && tokens.x_refresh_token)
                    resolve(tokens);
                else
                    reject(ErrorUtils.generateNewError(500));
            });

    });
};


/**
 * @memberOf Auth#
 * @param secret
 * @returns {Promise}
 */

Auth.prototype.generateOTP = function (secret) {
    return new Promise(function (resolve, reject) {
        var token = speakEasy.totp({
            secret: secret,
            encoding: 'base32'
        });
        token ? resolve(token) : reject(ErrorUtils.generateNewError(437));
    });

};

/**
 * @memberOf Auth#
 * @param secret
 * @param OTP
 * @returns {Promise}
 */
Auth.prototype.verifyOTP = function (secret, OTP) {
    return new Promise(function (resolve, reject) {
        var verified = speakEasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            window: 4,
            token: OTP
        });
        verified ? resolve(verified) : reject(ErrorUtils.generateNewError(410));
    });
};


/**
 * @memberOf Auth#
 */

Auth.prototype.runCron = function () {
    AuthCron.run();
};


module.exports = new Auth();