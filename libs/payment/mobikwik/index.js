/**
 * Created by kumardivyarajat on 21/09/16.
 */

var Mobikwik = require("./module/index");
var path = require("path");
var Config = require(path.resolve("./modules/config")).config.mobikwik;
var key;
var env = ENV; // dev or prod


var mobikwik = new Mobikwik(env);

if (env === "dev") {
    key = "test";
} else if (env === "prod") {
    key = "production";
} else {
    key = "test";
}

mobikwik
    .setMerchantId(Config[key].merchantID)
    .setLogginngEnabled(true);


// console.log("PAYTM", paytm);
// paytm._generateHash();

module.exports = {
    getPaymentUrl: function () {
        return mobikwik.paymentUrl;
    },
    generateHash: function (order, user, callbackUrl) {
        return mobikwik
            .setMerchantKey(Config[key].merchantKey)
            .setCallbackUrl(callbackUrl)
            .setOrderDetails(order, user)._generateHash();
    },

    handlePayment: function (data) {
        mobikwik.setMerchantKey(Config[key].merchantKey);

        if (mobikwik.isCheckSumValid(data)) {
            return true;
        } else {
            console.log("Data has been tampered with. Please verify again.");
            return false;
        }

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


// { MID: 'Reduxp44741768661035',
//     ORDERID: 'OD201701020000105',
//     TXNAMOUNT: '1.00',
//     CURRENCY: 'INR',
//     TXNID: '6563599367',
//     BANKTXNID: '5206491721',
//     STATUS: 'TXN_SUCCESS',
//     RESPCODE: '01',
//     RESPMSG: 'Txn Successful.',
//     TXNDATE: '2017-01-02 20:10:59.0',
//     GATEWAYNAME: 'WALLET',
//     BANKNAME: '',
//     PAYMENTMODE: 'PPI',
//     CHECKSUMHASH: 'OO1ObvvHDaEA/rKzRNa0xsmWQh3gGJfWuoFrfZfsf+klvX3PYDZHjUxH5UaIuN25nOYbE5hrN4qfvUnKZA2BOj9m8cJpKABkvueKjJhGcn4=' }
