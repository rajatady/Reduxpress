/**
 * Created by kumardivyarajat on 15/09/16.
 */

var request = require('request'),
    queryString = require('querystring'),
    crypto = require('crypto'),
    Promise = require('bluebird'),
    PayUMoneyError = require('./errors'),
    PaymentParams = require('./params');


/***
 * @memberOf PayUMoney
 * @type {{DEVELOPMENT: number, PRODUCTION: number}}
 */
var constants = {
    DEVELOPMENT: 0,
    PRODUCTION: 1
};
/***
 *
 * @param key
 * @param authHeader
 * @param env
 * @constructor
 */

var PayUMoney = function (key, authHeader, env) {

    if (!key) {
        throw PayUMoneyError.getInitError.constructorKeyMissingError();
    }

    if (typeof env == "undefined") {
        throw PayUMoneyError.getInitError.constructorEnvironmentError();
    }
    this.key = key;
    this.env = env;
    this._setHeaders(authHeader);
};


PayUMoney.prototype.CONSTANTS = constants;

/***
 *
 */
PayUMoney.prototype.header = {
    'Authorization': '',
    'Content-Type': '',
    'Content-Length': '',
    'content': '',
    'accept': ''
};

/***
 *
 * @param auth
 * @private
 */
PayUMoney.prototype._setHeaders = function (auth) {
    this.header['Authorization'] = auth;
    this.header['Content-Type'] = 'application/json';
    this.header['accept'] = "\*/\*";
};

/***
 *
 * @private
 */
PayUMoney.prototype._getBaseUrl = function () {
    var baseUrl = "";
    if (this.env == this.CONSTANTS.DEVELOPMENT) {
        baseUrl = 'https://test.payumoney.com';
    } else if (this.env == this.CONSTANTS.PRODUCTION) {
        baseUrl = 'https://www.payumoney.com';
    } else {
        throw PayUMoneyError.getInitError.constructorEnvironmentError();
    }
    console.log(this.env, baseUrl);
    return baseUrl;
};


/***
 *
 * @type {{PAYMENT_DETAILS: string, PAYMENT_STATUS: string, INITIATE_REFUND: string, REFUND_DETAILS: string, EMAIL_INVOICE: string, SMS_INVOICE: string}}
 * @private
 */
PayUMoney.prototype._urlFragment = {
    'PAYMENT_DETAILS': '/payment/op/getPaymentResponse?',
    'PAYMENT_STATUS': '/payment/payment/chkMerchantTxnStatus?',
    'INITIATE_REFUND': '/payment/merchant/refundPayment?',
    'REFUND_DETAILS': '/treasury/ext/merchant/getRefundDetailsByPayment?',
    'EMAIL_INVOICE': '/payment/payment/addInvoiceMerchantAPI?',
    'SMS_INVOICE': '/payment/payment/smsInvoice?'
};


PayUMoney.prototype._method = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
};

/***
 *
 * @returns {string}
 * @private
 */
PayUMoney.prototype._getHashSequence = function () {
    return "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10";
};


/***
 *
 * @private
 */
PayUMoney.prototype._getPaymentUrl = function () {
    var baseUrl = "";
    if (this.env === this.CONSTANTS.DEVELOPMENT) {
        baseUrl = 'https://test.payu.in/_payment';
    } else if (this.env === this.CONSTANTS.PRODUCTION) {
        baseUrl = 'https://secure.payu.in/_payment';
    } else {
        throw PayUMoneyError.getInitError.constructorEnvironmentError();
    }
    return baseUrl;
};


/***
 *
 * @param url
 * @param method
 * @private
 *
 */
PayUMoney.prototype._request = function (method, url) {

    var payumoney = this;

    return new Promise(function (resolve, reject) {
        request({
            method: method,
            url: url,
            headers: payumoney.header
        }, function (error, result, body) {
            if (error) {
                reject(error);
            } else if (result.statusCode != 200) {
                reject(PayUMoneyError.getRequestError(result.statusCode));
            } else if (!error && result.statusCode === 200) {
                resolve(JSON.parse(body));
            }
        });
    });
};


/***
 *
 * @param paymentParams
 *
 */
PayUMoney.prototype.setPaymentParams = function (paymentParams) {

    if (paymentParams instanceof PaymentParams === false) {
        throw PayUMoneyError.getInvalidPaymentParamsError.constructor();
    } else {
        paymentParams.key = this.key;
        this._paymentParams = paymentParams;
    }

    return this;
};


PayUMoney.prototype.hashBeforeTransaction = function (salt) {

    if (this._paymentParams instanceof PaymentParams === false || !this._paymentParams) {
        throw PayUMoneyError.getInvalidPaymentParamsError.paymentParamsNotInit();
    }
    var key = "",
        string = "";
    var data = this._paymentParams;
    var sequence = this._getHashSequence().split('|');
    if (!(data && salt))
        return "Data and Salt Required";
    for (var i = 0; i < sequence.length; i++) {
        key = sequence[i];
        string += data[key] + '|';
    }
    string += salt;
    console.log(string);
    return crypto.createHash('sha512', salt).update(string).digest('hex');
};


PayUMoney.prototype.transactionStatus = function (data) {
    var string = "";
    data.transactionIds.forEach(function (merchantId) {
        string = merchantId + "|";
    });
    string = string.substr(0, string.length - 1);
    var qs = queryString.stringify({
        merchantKey: this.key,
        merchantTransactionIds: string
    });
    var url = this._getBaseUrl() + this._urlFragment.PAYMENT_STATUS + qs;
    console.log("Url ->", url);

    return this._request(this._method.POST, url);
};

PayUMoney.prototype.hashAfterTransaction = function (data, salt) {
    var key = "",
        string = "";
    var sequence = this._getHashSequence();
    sequence = sequence.split('|').reverse();
    if (!(data && salt && data.status))
        return "Data, Salt, and TransactionStatus Required";
    string += salt + '|' + data.status + '|';
    for (var i = 0; i < sequence.length; i++) {
        key = sequence[i];
        string += data[key] + '|';
    }
    string = string.substr(0, string.length - 1);
    return (crypto.createHash('sha512', salt).update(string).digest('hex') === data.hash);
};
/***
 *
 * @type {PayUMoney}
 */
module.exports.PayU = PayUMoney;

module.exports.params = PaymentParams;
module.exports.DEVELOPMENT = constants.DEVELOPMENT;
module.exports.PRODUCTION = constants.PRODUCTION;


