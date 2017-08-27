/**
 * Created by kumardivyarajat on 21/09/16.
 */

var Freecharge = require("./module/index");
var path = require("path");
var freecharge = new Freecharge(ENV);
var Config = require(path.resolve("./modules/config")).config;


freecharge
    .setMerchantId(Config.freecharge.merchantID)
    .setMerchantSecretKey(Config.freecharge.secretKey)
    .setChannel("WEB");

// console.log("freecharge", freecharge);
// paytm._generateHash();

module.exports = {
    getPaymentUrl: function () {
        return freecharge.paymentUrl + "/api/v1/co/pay/init";
    },
    generateHash: function (order, user, callbackUrls) {
        return freecharge
            .setSuccessUrl(callbackUrls.surl)
            .setFailureUrl(callbackUrls.furl)
            .setOrderDetails(order, user)
            ._generateHash();
    },


    verifyChecksum: function (data) {
        return freecharge.verifyCheckSum(data)
    }
};