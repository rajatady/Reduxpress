/**
 * Created by kumardivyarajat on 15/09/16.
 */
/***
 *
 * @constructor
 */

var PaymentParams = function () {
    this.key = '';
    this.txnid = '';
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.phone = '';
    this.productinfo = '';
    this.amount = '';
    this.surl = '';
    this.furl = '';
    this.hash = '';
    this.service_provider = 'payu_paisa';
    this.address1 = '';
    this.address2 = '';
    this.city = '';
    this.state = '';
    this.country = '';
    this.zipcode = '';
    this.udf1 = '';
    this.udf2 = '';
    this.udf3 = '';
    this.udf4 = '';
    this.udf5 = '';
    this.udf6 = '';
    this.udf7 = '';
    this.udf8 = '';
    this.udf9 = '';
    this.udf10 = '';
};


/***
 *
 * @param txnid
 * @returns {PaymentParams}
 *
 */
PaymentParams.prototype.setTransactionId = function (txnid) {
    this.txnid = txnid;
    return this;
};

/**
 * @param message
 * @returns {PaymentParams}
 */

PaymentParams.prototype.setProductInfo = function (message) {
    this.productinfo = message;
    return this;
};

/***
 *
 * @param amount
 * @returns {PaymentParams}
 *
 */
PaymentParams.prototype.setAmount = function (amount) {
    this.amount = amount;
    return this;
};

/***
 *
 * @param firstName
 * @returns {PaymentParams}
 */
PaymentParams.prototype.setFirstName = function (firstName) {
    this.firstname = firstName;
    return this;
};

/***
 *
 * @param lastName
 * @returns {PaymentParams}
 */
PaymentParams.prototype.setLastName = function (lastName) {
    this.lastName = lastName;
    return this;
};

/***
 *
 * @param email
 * @returns {PaymentParams}
 */
PaymentParams.prototype.setEmail = function (email) {
    this.email = email;
    return this;
};

/***
 *
 * @param mobile
 * @returns {PaymentParams}
 */
PaymentParams.prototype.setMobileNumber = function (mobile) {
    this.phone = mobile;
    return this;
};

/***
 *
 * @returns {PaymentParams}
 * @param udf1
 */
PaymentParams.prototype.setUdf1 = function (udf1) {
    this.udf1 = udf1;
    return this;
};


/***
 *
 * @returns {PaymentParams}
 * @param udf1
 */
PaymentParams.prototype.setSuccessUrl = function (surl) {
    this.surl = surl;
    return this;
};


/***
 *
 * @returns {PaymentParams}
 * @param udf1
 */
PaymentParams.prototype.setFailureUrl = function (furl) {
    this.furl = furl;
    return this;
};


/***
 *
 * @returns {PaymentParams}
 * @param udf2
 */
PaymentParams.prototype.setUdf2 = function (udf2) {
    this.udf2 = udf2;
    return this;
};


/***
 *
 * @returns {PaymentParams}
 * @param udf3
 */
PaymentParams.prototype.setUdf3 = function (udf3) {
    this.udf3 = udf3;
    return this;
};


/***
 *
 * @returns {PaymentParams}
 * @param udf4
 */
PaymentParams.prototype.setUdf4 = function (udf4) {
    this.udf4 = udf4;
    return this;
};


/***
 *
 * @returns {PaymentParams}
 * @param udf5
 */
PaymentParams.prototype.setUdf5 = function (udf5) {
    this.udf5 = udf5;
    return this;
};


/***
 *
 * @type {PaymentParams}
 */
module.exports = PaymentParams;


