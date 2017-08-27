/**
 * Created by kumardivyarajat on 05/09/16.
 */
var PayUMoney = require('./payumoney');
var Config = require("../../../config");
var requestHandler = require('../.././request/index');
var responseHandler = require('../.././response/index');
var moment = require("moment");
var path = require("path");
var PayU = require('./module/index');
var PayUParams = require('./module/params');
var SentSms = require("../.././sms/index");
var MSG91 = require("msg91-rdx");


var options = {
    authKey: Config.msg91.authKey,
    sender: Config.msg91.sender, // Your sender ID,
    route: Config.msg91.route,
    logging: true //Optional - Whether to log data
};


var msg91 = new MSG91(options);

var payumoney = new PayU.PayU(Config.payumoney.production.merchant_key, Config.payumoney.production.authHeader, PayU.DEVELOPMENT);

var payuparams = new PayUParams();

var env = "";
var testEnabled = true;
if (testEnabled) {
    env = "test";
} else {
    env = "production";
}

module.exports.handlePayment = function (request, response) {

var a = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">" +
    "<html>" +
    "<title>PayUMoney</title>" +
    " <body onload=\"PayUMoney.success(1)\">" +
    "</body>" +
    "<html>";

    if (request.body) {
        return response.send(a);
    }

};


module.exports.generateHash = function (request, response) {

    var params = ["amount", "email", "firstname", "phone"];
    var data = {};
    requestHandler.asyncRequestHelper(request, params, true)
        .then(function (res) {
            var amount = parseInt(request.body.amount).toFixed(1);
            data = PayUMoney.paymentFields();

            data.key = Config.payumoney[env].merchant_key;
            data.txnid = _generateTxnId();
            data.amount = parseFloat(amount).toFixed(1);
            data.surl = Config.payumoney[env].surl;
            data.furl = Config.payumoney[env].furl;
            data.productinfo = "FreshBytWallet";
            data.email = request.body.email;
            data.firstname = request.body.firstname;
            data.udf1 = "";
            data.udf2 = "";
            data.udf3 = "";
            data.udf4 = "";
            data.udf5 = "";
            console.log(typeof data.amount);
            console.log(data);

            PayUMoney.hashBeforeTransaction(data, Config.payumoney[env].salt, function (hash) {
                data.hash = hash;
                data.merchantid = Config.payumoney[env].merchant_id;
                data.phone = request.body.phone;
                console.log(data);
                responseHandler.responseHelper(response, {"params": data});
            });
        })
        .catch(function (err) {
            return responseHandler.responseHelper(response, err.message ? err.message : err, {code: err.code ? err.code : 500})
        })
};


module.exports.verifyPayment = function (request, response) {
    var params = ["paymentId"];
    var paymentId = request.body.paymentId;
    var APPData = requestHandler.getAgent(request);
    var user = request.decoded;
    console.log(user);
    var paymentData = {};

    var smsData = {
        mobile: "",
        message: "",
        statusCode: "",
        deliveryStatus: "",
        tag: "WALLET_RECHARGE",
        meta: {
            key: "",
            value: ""
        },
        agent: APPData.agent
    };


    requestHandler.asyncRequestHelper(request, params, true)
        .then(function (res) {
            var data = {
                transactionIds: [paymentId]
            };
            return payumoney.transactionStatus(data);
        })
        .then(function (body) {
            global.Log.clog("PAYMENT BODY", body);
            if (body.status == 0) {
                paymentData = body.result[0];
                console.log("*********************************************PAYMENT DATA****************************");
                console.log(paymentData);
                console.log("****************************************************************************************");
                return User.findById(user.id).exec();
            }
        })
        .then(function (auser) {
            console.log("*************************************************USER FIND************************");
            console.log(auser);
            console.log("****************************************************************************************");
            user = auser;
            if (auser.userCredit) {
                auser.userCredit += paymentData.amount;
            } else {
                auser.userCredit = paymentData.amount;

            }
            return auser.save();
        })
        .then(function (auser) {
            console.log("*************************************************USER WALLET UPDATE************************");
            console.log(auser);
            console.log("******************************************************************************************");
            user = auser;
            smsData.meta.key = "TRANSACTION_ID";
            smsData.meta.value = paymentData.merchantTransactionId;
            return Credits
                .saveRechargeHistory(
                    paymentData.amount,
                    user,
                    paymentData.status,
                    paymentData.paymentId,
                    paymentData.merchantTransactionId
                )
        })
        .then(function (credit) {
            console.log("********************************************TRANSACTION HISTORY********************************************");
            console.log(credit);
            console.log("****************************************************************************************");
            var message = "Dear " + user.name + "."
                + " Recharge of Rs " + paymentData.amount + " for FreshByt Wallet is successful."
                + " Updated Wallet Balance - Rs " + user.userCredit + ".";

            var data = {
                mobiles: user.mobile,
                message: message
            };

            smsData.mobile = user.mobile;
            smsData.message = message;

            return msg91.send(data);
        })
        .then(function (response) {
            console.log("********************************************SMS MESSAGE********************************************");
            console.log("Sms sent - ", response);
            console.log("****************************************************************************************");
            smsData.deliveryStatus = 0;
            smsData.statusCode = response.data.message;
            return SentSms.saveSentSms(smsData);
        })
        .then(function (sms) {
            console.log("********************************************SMS TO DB********************************************");
            console.log("Sms saved to db - ", sms);
            console.log("****************************************************************************************");
            responseHandler.responseHelper(response, {userCredit: user.userCredit});
        })
        .catch(function (err) {
            console.log(err._captureStackTrace, err);
            return responseHandler.responseHelper(response, err.message ? err.message : err, {code: err.code ? err.code : 500})
        })
};


function _generateTxnId() {
    return "PM" + moment();
}