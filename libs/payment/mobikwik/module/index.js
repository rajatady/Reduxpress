/**
 * Created by kumardivyarajat on 21/09/16.
 */
var Promise = require("bluebird");
var checkSum = require("./libs/checksum");
var _ = require("lodash");
var path = require("path");
var MobikwikConstants = require(path.resolve("./modules/config")).config.mobikwik;


var Mobikwik = function (ENV) {
    this.fields = {};
    if (ENV === "dev") {
        this.paymentUrl = MobikwikConstants.url.test;
        this.fields._loggingEnabled = true;
    } else if (ENV === "prod") {
        this.paymentUrl = MobikwikConstants.url.production;
        this.fields._loggingEnabled = false;
    }
};

Mobikwik.prototype.setMerchantId = function (merchantId) {
    this.fields.mid = merchantId;
    return this;
};

Mobikwik.prototype.setMerchantKey = function (mk) {
    this.fields._merchantKey = mk;
    return this;
};


Mobikwik.prototype.setMerchantName = function (merchantName) {
    this.fields.merchantname = merchantName;
    return this;
};

// Mobikwik.prototype.setWebsite = function (webiste) {
//     this.fields.WEBSITE = webiste;
//     return this;
// };


// Mobikwik.prototype.setChannelId = function (channelId) {
//     this.fields.CHANNEL_ID = channelId;
//     return this;
// };

// Mobikwik.prototype.setIndutcryType = function (industryType) {
//     this.fields.INDUSTRY_TYPE_ID = industryType;
//     return this;
// };

Mobikwik.prototype.setLogginngEnabled = function (loggingEnabled) {
    this.fields._loggingEnabled = loggingEnabled;
    return this;
};

Mobikwik.prototype.setCallbackUrl = function (callbackUrl) {
    this.fields.redirecturl = callbackUrl;
    return this;
};

Mobikwik.prototype.setOrderDetails = function (order, user) {
    this.fields.orderid = order.orderNumber;
    // this.fields.CUST_ID = user._id;
    this.fields.amount = parseInt(order.amount);
    this.fields.cell = user.mobile;
    this.fields.email = user.email;
    // this.fields.ORDER_DETAILS = order.product;
    // this.fields.VERIFIED_BY = "MOBILE";
    // this.fields.IS_USER_VERIFIED = "YES";
    // this.fields.ADDRESS_1 = order.address.streetAddress;
    // this.fields.ADDRESS_2 = order.address.landmark;
    // this.fields.CITY = order.address.city;
    // this.fields.STATE = order.address.state;
    // this.fields.PINCODE = order.address.pinCode;
    return this;
};

Mobikwik.prototype._generateHash = function () {
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


Mobikwik.prototype.isCheckSumValid = function (data) {
    return (checkSum.verifychecksum(data, this.fields._merchantKey));
};

Mobikwik.prototype._validateFields = function () {

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


Mobikwik.prototype.trimFrontSlash = function (string) {
    return string.replace("_", "");
};


Mobikwik.prototype.PRODUCTION = Production = 1;
Mobikwik.prototype.DEVELOPMENT = Development = 0;


module.exports = Mobikwik;