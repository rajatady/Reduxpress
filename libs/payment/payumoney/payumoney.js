/**
 * Created by kumardivyarajat on 08/09/16.
 */
var request = require('request'),
    queryString = require('querystring'),
    crypto = require('crypto');

var BASE_URL = 'https://test.payumoney.com';
var BASE_PROD_URL = 'https://www.payumoney.com';

var CREATE_PAYEMENT = 'https://test.payu.in/_payment';

var ENDPOINTS = {
    'PAYEMENT_DETAILS': '/payment/op/getPaymentResponse?',
    'PAYMENT_STATUS': '/payment/payment/chkMerchantTxnStatus?',
    'INITIATE_REFUND': '/payment/merchant/refundPayment?',
    'REFUND_DETAILS': '/treasury/ext/merchant/getRefundDetailsByPayment?',
    'EMAIL_INVOICE': '/payment/payment/addInvoiceMerchantAPI?',
    'SMS_INVOICE': '/payment/payment/smsInvoice?'
};

module.exports = {
    HEADERS: {
        'Authorization': '',
        'Content-Type': '',
        'Content-Length': '',
        'content': '',
        'accept': ''
    },
    hashSequence: "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5",
    setHeaders: function (auth) {
        this.HEADERS['Authorization'] = auth;
        this.HEADERS['Content-Type'] = 'application/json';
        this.HEADERS['accept'] = '*/*';
    },
    caller: function (url, method, callback) {
        var headers = this.HEADERS;
        console.log("   ---  ", headers);
        request({
            method: method,
            url: url,
            headers: headers
        }, function (error, result, body) {
            if (!error && result.statusCode === 200)
                body = JSON.parse(body);
            callback(error, result, body);
        });
    },
    paymentFields: function () {
        return ({
            'key': '',
            'txnid': '',
            'firstname': '',
            'lastname': '',
            'email': '',
            'phone': '',
            'productinfo': '',
            'amount': '',
            'surl': '',
            'furl': '',
            'hash': '',
            'service_provider': 'payu_paisa',
            'address1': '',
            'address2': '',
            'city': '',
            'state': '',
            'country': '',
            'zipcode': '',
            'udf1': '',
            'udf2': '',
            'udf3': '',
            'udf4': '',
            'udf5': ''
        });
    },
    getRefundFields: function () {
        return ({
            "merchantKey": "",
            "paymentId": "",
            "refundAmount": ""
        })
    },
    emailInvoiceFields: function () {
        return ({
            "customerName": "",
            "customerEmail": "",
            "customerPhone": "",
            "amount": "",
            "paymentDescription": "",
            "transactionId": "",
            "sendEmail": "",
            "expiryTime": ""
        });
    },
    smsInvoiceFields: function () {
        return ({
            "customerName": "",
            "customerMobileNumber": "",
            "amount": "",
            "description": "",
            "invoiceReferenceId": "",
            "confirmSMSPhone": ""
        })
    },
    hashBeforeTransaction: function (data, salt, callback) {
        var key = "",
            string = "";
        var sequence = this.hashSequence.split('|');
        if (!(data && salt))
            return "Data and Salt Required";
        for (var i = 0; i < sequence.length; i++) {
            key = sequence[i];
            string += data[key] + '|';
        }
        string += salt;
        console.log(string);
        return callback(crypto.createHash('sha512', salt).update(string).digest('hex'));
    },
    hashAfterTransaction: function (data, salt, transactionStatus, callback) {
        var key = "",
            string = "";
        var sequence = this.hashSequence.split('|').reverse();
        if (!(data && salt && transactionStatus))
            return "Data, Salt, and TransactionStatus Required";
        string += salt + '|' + transactionStatus + '|';
        for (var i = 0; i < sequence.length; i++) {
            key = sequence[i];
            string += data[key] + '|';
        }
        string = string.substr(0, string.length - 1);
        return callback(crypto.createHash('sha512', salt).update(string).digest('hex'));
    },
    getPaymentDetails: function (data, callback) {
        var string = "";
        data.transactionIds.forEach(function (merchantId) {
            string = merchantId + "|";
        });
        string = string.substr(0, string.length - 1);
        var qs = queryString.stringify({
            merchantKey: data.key,
            merchantTransactionIds: string,
            from: data.from,
            to: data.to,
            count: data.numberOfPayments
        });
        var url = BASE_PROD_URL + ENDPOINTS.PAYEMENT_DETAILS + qs;
        console.log("Url ->", url);
        this.caller(url, 'POST', callback);
    },
    transactionStatus: function (data, callback) {
        var string = "";
        data.transactionIds.forEach(function (merchantId) {
            string = merchantId + "|";
        });
        string = string.substr(0, string.length - 1);
        var qs = queryString.stringify({
            merchantKey: data.key,
            merchantTransactionIds: string
        });
        var url = BASE_PROD_URL + ENDPOINTS.PAYMENT_STATUS + qs;
        console.log("Url ->", url);
        this.caller(url, 'POST', callback);
    },
    initiateRefund: function (data, callback) {
        var qs = queryString.stringify({
            merchantKey: data.key,
            paymentId: data.paymentId,
            refundAmount: data.amount
        });
        var url = BASE_URL + ENDPOINTS.INITIATE_REFUND + qs;
        this.caller(url, 'POST', callback);
    },
    paymentRefundDetails: function (data, callback) {
        var qs = queryString.stringify({
            merchantKey: data.key,
            paymentId: data.paymentId
        });
        var url = BASE_URL + ENDPOINTS.REFUND_DETAILS + qs;
        this.caller(url, 'POST', header, callback);
    },
    refundDetails: function (data, callback) {
        var qs = queryString.stringify({
            merchantKey: data.key,
            refundId: data.refundId
        });
        var url = BASE_URL + ENDPOINTS.REFUND_DETAILS + qs;
        this.caller(url, 'GET', header, callback);
    },
    emailInvoice: function (data, callback) {
        var qs = queryString.stringify({
            customerName: data.name,
            customerEmail: data.email,
            customerPhone: data.phone,
            amount: data.amount,
            paymentDescription: data.description,
            transactionId: data.transactionId,
            sendEmail: data.sendEmail,
            expiryTime: data.expiry
        });
        var url = BASE_URL + ENDPOINTS.EMAIL_INVOICE + qs;
        this.caller(url, 'POST', callback)
    },
    smsInvoice: function (data, callback) {
        var qs = queryString.stringify({
            customerName: data.name,
            customerMobileNumber: data.phone,
            amount: data.amount,
            description: data.description,
            invoiceReferenceId: data.transactionId,
            confirmSMSPhone: data.confirmPhone
        });
        var url = BASE_URL + ENDPOINTS.SMS_INVOICE + qs;
        this.caller(url, 'POST', callback);
    }
};