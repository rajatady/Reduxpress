/**
 * Created by kumardivyarajat on 21/09/16.
 */

var Paytm = require("./module/index");
var path = require("path");
var Config = require(path.resolve("./modules/config")).config.paytm;
var key;
var env = "prod"; // dev or prod


var paytm = new Paytm(env);

if (env === "dev") {
    key = "test";
} else if (env === "prod") {
    key = "production";
}

paytm
    .setMerchantId(Config[key].merchantID)
    .setIndutcryType(Config[key].industryType)
    .setChannelId(Config.channelId)
    .setWebsite(Config[key].website)
    .setLogginngEnabled(true);


// console.log("PAYTM", paytm);
// paytm._generateHash();

module.exports = {
    getPaymentUrl: function () {
        return paytm.paymentUrl;
    },
    generateHash: function (order, user, callbackUrl) {
        return paytm.setMerchantKey(Config[key].merchantKey).setCallbackUrl(callbackUrl)
            .setOrderDetails(order, user)._generateHash();
    },


    handlePayment: function (data) {
        paytm.setMerchantKey(Config[key].merchantKey);
        return new Promise(function (resolve, reject) {
            // console.log("Da",data);
            if (paytm.isCheckSumValid(data)) {
                console.log(data);
                if (data.RESPCODE === "01") {
                    resolve(data);
                } else {
                    reject();
                }
            } else {
                console.log("Data has been tampered with. Please verify again.");
                var err = new Error("Payment has been tampered with. Sending error report to admin.");
                err.code = 500;
                reject(err);
            }
        });
    },
};

//
// { RESPCODE: '14112',
//     RESPMSG: 'Looks like you cancelled the payment. You can try again now or if you faced any issues in completing the payment, please contact us',
//     STATUS: 'TXN_FAILURE',
//     MID: 'Reduxp44741768661035',
//     TXNAMOUNT: '13.00',
//     ORDERID: 'OD201612270000094',
//     TXNID: '6519127191',
//     CHECKSUMHASH: 'G1IkpWwp4XJSrfOsrbWFMV9qXec3ryTKhx5SKfbRaLezU43PtKEWkfbgbjLrhi4sm5+Yu/zVDdoguoCR+LE4YhVG309gqlBwd/D0Zr8Y7No=' }
//

