/**
 * Created by Mir Rayees on 23/09/16.
 */
var JWT = require("jsonwebtoken");
var speakEasy = require('speakeasy');
var request = require("request");
var ErrorUtils = require("../error/index");

/**
 * @memberOf Auth#
 * @constructor
 */
function Auth(appSecret) {
    this.secret = appSecret;
}

/**
 * @memberOf Auth#
 * @param token
 * @returns {Promise}
 */

Auth.prototype.validateToken = function (token) {
    var vm = this;
    return new Promise(function (resolve, reject) {
        JWT.verify(token, vm.secret, function (error, decoded) {
            if (error) {
                reject(ErrorUtils.generateNewError(413));
            }
            else {
                var dataToReturn;
                if (!dataToReturn) {
                    dataToReturn = decoded.user;
                }
                if (!dataToReturn) {
                    dataToReturn = decoded._doc;
                }
                if(!dataToReturn) {
                    dataToReturn = decoded;
                }
                resolve(dataToReturn);
            }
        })
    })
};

/**
 * @memberOf Auth#
 * @param token
 * @param authOptions
 * @returns {Promise}
 */

Auth.prototype.validateExternalToken = function (token, authOptions) {
    return new Promise(function (resolve, reject) {
        request(authOptions.apiUrl, {
            headers: {
                'x-access-token': token
            },
            method: authOptions.method || 'GET',
            json: {
                oauth: authOptions.oauthToken,
                token: token
            }
        }, function (err, rsp, body) {
            if (err) {
                reject(err)
            } else {
                var user = body.message.users[0]
                if (user.id && !user._id) {
                    user._id = user.id
                }
                if (!user.id && user._id) {
                    user.id = user._id
                }

                resolve(user)
            }
        })
    })
};

/**
 * @memberOf Redux#
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
    var vm = this;
    return new Promise(function (resolve, reject) {
        var tokens = {};
        if (!(unit in TimeUnits))
            reject(ErrorUtils.generateNewError(500, "Invalid Time Units"));
        var accessTime = accessTokenTime + TimeUnits[unit].toUpperCase();
        var refreshTime = refreshTokenTime + TimeUnits[unit].toUpperCase();
        tokens.x_access_token = JWT.sign(user, vm.secret, {expiresIn: accessTime});
        tokens.x_refresh_token = JWT.sign(user, vm.secret.substr(0, vm.secret.length / 2), {expiresIn: refreshTime});
        tokens.secret = vm.secret;
        if (vm.secret && tokens.x_access_token && tokens.x_refresh_token)
            resolve(tokens);
        else
            reject(ErrorUtils.generateNewError(500));

    });
};


/**
 * @memberOf Redux#
 * @description Generates a new otp based on the secret provided
 * @param {string} secret The secret to be used for generating the OTP.
 * @param {object} [options]
 * @param {number} [options.step=30] The time for which the OTP is valid in seconds. Defaults to 30 seconds.
 * @param {number} [options.digits=6] The number of digits in the OTP. Defaults to 6.
 * @returns {Promise}
 */
Auth.prototype.generateOTP = function (secret, options) {
    if (!options)
        options = {};
    return new Promise(function (resolve, reject) {
        resolve(speakEasy.totp({
            secret: secret,
            encoding: 'base32',
            step: options.step || 30,
            digits: options.digits || 6
        }));
    });

};

/**
 * @version 1.0.1
 * @description Verifies the OTP based on the secret provided
 * @memberOf Auth#
 * @param secret
 * @param OTP
 * @param {object} [options]
 * @param {number} [options.step=30] The time for which the OTP is valid in seconds. Defaults to 30 seconds.
 * @param {number} [options.digits=6] The number of digits in the OTP. Defaults to 6.
 * @returns {Promise}
 */
Auth.prototype.verifyOTP = function (secret, OTP, options) {
    if (!options)
        options = {};
    return new Promise(function (resolve, reject) {
        resolve(speakEasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            window: 4,
            token: OTP,
            step: options.step || 30,
            digits: options.digits || 6
        }));
    });
};


/**
 * @memberOf Auth#
 * @deprecated
 */

Auth.prototype.runCron = function () {

    // AuthCron.run();
};


module.exports = Auth;
