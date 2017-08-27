/**
 * Created by kumardivyarajat on 21/09/16.
 */
var Promise = require("bluebird");
var checkSum = require("./libs/checksum");
var _ = require("lodash");
var path = require("path");
var PaytmConstants = require(path.resolve("./modules/config")).config.paytm;


var Paytm = function (ENV) {
    this.fields = {};
    if (ENV === "dev") {
        this.paymentUrl = PaytmConstants.url.development;
        this.fields._loggingEnabled = true;
    } else if (ENV === "prod") {
        this.paymentUrl = PaytmConstants.url.production;
        this.fields._loggingEnabled = false;
    }
};

Paytm.prototype.setMerchantId = function (merchantId) {
    this.fields.MID = merchantId;
    return this;
};

Paytm.prototype.setMerchantKey = function (mk) {
    this.fields._merchantKey = mk;
    return this;
};

Paytm.prototype.setWebsite = function (webiste) {
    this.fields.WEBSITE = webiste;
    return this;
};


Paytm.prototype.setChannelId = function (channelId) {
    this.fields.CHANNEL_ID = channelId;
    return this;
};

Paytm.prototype.setIndutcryType = function (industryType) {
    this.fields.INDUSTRY_TYPE_ID = industryType;
    return this;
};

Paytm.prototype.setLogginngEnabled = function (loggingEnabled) {
    this.fields._loggingEnabled = loggingEnabled;
    return this;
};

Paytm.prototype.setCallbackUrl = function (callbackUrl) {
    this.fields.CALLBACK_URL = callbackUrl;
    return this;
};

Paytm.prototype.setOrderDetails = function (order, user) {
    this.fields.ORDER_ID = order.orderNumber;
    this.fields.CUST_ID = user._id;
    this.fields.TXN_AMOUNT = parseInt(order.amount);
    this.fields.MOBILE_NO = user.mobile;
    this.fields.EMAIL = user.email;
    // this.fields.ORDER_DETAILS = order.product;
    this.fields.VERIFIED_BY = "MOBILE";
    this.fields.IS_USER_VERIFIED = "YES";
    // this.fields.ADDRESS_1 = order.address.streetAddress;
    // this.fields.ADDRESS_2 = order.address.landmark;
    // this.fields.CITY = order.address.city;
    // this.fields.STATE = order.address.state;
    // this.fields.PINCODE = order.address.pinCode;
    return this;
};

Paytm.prototype._generateHash = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
        self._validateFields();
        checkSum.genchecksum(self.fields, self.fields._merchantKey, function (err, result) {
            if (err) {
                reject(err);
            } else {
                var a = {};
                _.assign(a, result);
                delete a._merchantKey;
                console.log(a, self.fields);
                resolve(a);
            }
        });
    });
};


Paytm.prototype.isCheckSumValid = function (data) {
    return (checkSum.verifychecksum(data, this.fields._merchantKey));
};

Paytm.prototype._validateFields = function () {

    var self = this;
    var error = new Error();
    var errors = [];
    _.forOwn(self.fields, function (value, key) {
        console.log(key + " - > " + value);
        if (!value || typeof value === "undefined" || value === "") {
            errors.push("\n\tField Not Initialized   -> " + self.trimFrontSlash(key));
            // self.clog("Field Not Initialized", self.trimFrontSlash(key));
        }
    });
    if (errors.length !== 0) {
        error.message = errors;
        throw error;
    }
};


Paytm.prototype.trimFrontSlash = function (string) {
    return string.replace("_", "");
};


Paytm.prototype.PRODUCTION = Production = 1;
Paytm.prototype.DEVELOPMENT = Development = 0;


module.exports = Paytm;