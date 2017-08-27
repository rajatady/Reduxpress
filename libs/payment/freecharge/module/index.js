/**
 * Created by kumardivyarajat on 21/09/16.
 */
var Promise = require("bluebird");
var checkSum = require("./libs/checksum");
var _ = require("lodash");

var Freecharge = function (ENV) {
    this.fields = {};
    if (ENV == "dev") {
        this.paymentUrl = "https://checkout-sandbox.freecharge.in";
        this._loggingEnabled = true;
    } else if (ENV == "prod") {
        this.paymentUrl = "https://checkout.freecharge.in";
        this._loggingEnabled = false;
    }
};

Freecharge.prototype.setMerchantId = function (merchantId) {
    this.fields.merchantId = merchantId;
    return this;
};

Freecharge.prototype.setMerchantSecretKey = function (mk) {
    this._merchantKey = mk;
    return this;
};

// Freecharge.prototype.setWebsite = function (merchantTxnId) {
//     this.fields.merchantTxnId = merchantTxnId;
//     return this;
// };


Freecharge.prototype.setChannel = function (channel) {
    this.fields.channel = channel;
    return this;
};

Freecharge.prototype.setSuccessUrl = function (surl) {
    this.fields.surl = surl;
    return this;
};

Freecharge.prototype.setFailureUrl = function (furl) {
    this.fields.furl = furl;
    return this;
};

Freecharge.prototype.setLogginngEnabled = function (loggingEnabled) {
    this._loggingEnabled = loggingEnabled;
    return this;
};

Freecharge.prototype.setOrderDetails = function (order, user) {
    console.log(order, user);
    this.fields.merchantTxnId = order.orderNumber;
    this.fields.amount = parseInt(order.amount);
    this.fields.mobile = user.mobile;
    this.fields.email = user.email;
    this.fields.customerName = user.name;
    this.fields.productInfo = "Aadira";
    return this;
};

Freecharge.prototype._generateHash = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
        self._validateFields();
        checkSum.genchecksum(self.fields, self._merchantKey, function (err, result) {
            if (err) {
                reject(err);
            } else {
                delete result._merchantKey;
                resolve(result);
            }
        });
    });
};


Freecharge.prototype.verifyCheckSum = function (data) {
    return checkSum.verifychecksum(data, this._merchantKey);
};


Freecharge.prototype._validateFields = function () {

    var self = this;
    var error = new Error();
    var errors = [];
    _.forOwn(self, function (value, key) {
        if (!value || value === "undefined" || value === "") {
            errors.push("\n\tField Not Initialized   -> " + self.trimFrontSlash(key));
            // self.clog("Field Not Initialized", self.trimFrontSlash(key));
        }
    });
    if (errors.length !== 0) {
        error.message = errors;
        throw error;
    }
};


Freecharge.prototype.trimFrontSlash = function (string) {
    return string.replace("_", "");
};


Freecharge.prototype.PRODUCTION = Production = 1;
Freecharge.prototype.DEVELOPMENT = Development = 0;


module.exports = Freecharge;