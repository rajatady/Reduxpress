/**
 * Created by kumardivyarajat on 15/09/16.
 */


var exampleUsage = "\n\n\n\t\t\t******************************  Example Usage : - ***********************************\n" +
    "\t\t\tvar PayUMoney = require('PayUMoney');\n" +
    "\t\t\t..\n" +
    "\t\t\t..\n" +
    "\t\t\t..\n" +
    "\t\t\tvar PayUMoney = new PayUMoney.init('merchantKey', PayUMoney.DEVELOPMENT );  // For Development\n" +
    "\t\t\tvar PayUMoney = new PayUMoney.init('merchantKey', PayUMoney.PRODUCTION );  // For Production\n";


var examplePaymentParams = "\n\n\n\t\t\t******************************  Payment Params Example : - ***********************************\n" +
    "\t\t\tvar PayUMoney = require('PayUMoney');\n" +
    "\t\t\t..\n" +
    "\t\t\t..\n" +
    "\t\t\t..\n" +
    "\t\t\tvar PayUMoney = new PayUMoney.init('merchantKey', PayUMoney.DEVELOPMENT ); //Init Payumoney\n" +
    "\t\t\t..\n" +
    "\t\t\t..\n" +
    "\t\t\t..\n" +
    "\t\t\t var params = new PayUMoney.PaymentParams();\n" +
    "\t\t\t params.setTransactionId('txnId')\n" +
    "\t\t\t       .setAmount(10); // All methods can be chained together\n" +
    "\t\t\t PayUMoney.setPaymentParams(params);\n" +
    "";


module.exports.getInitError = {
    constructorKeyMissingError: function () {
        return new Error("\tA valid merchant key is required. " + exampleUsage);
    },
    constructorEnvironmentError: function () {
        return new Error("\tEnvironment can be 0 for development and 1 for production. \n\tSee the example usage below for use of constants." + exampleUsage)
    }
};

module.exports.getInvalidPaymentParamsError =  {
    constructor : function () {
        return new Error("\t PaymentParams must be an instance of PayUMoney.PaymentParams. \n" + examplePaymentParams);
    },
    paymentParamsNotInit : function () {
        return new Error("\t PaymentParams passed to PayUMoney instance. \n" + examplePaymentParams);
    }
};


var PayUMoneyErrorCodes = {
    400: {
        code: 400,
        message: "Bad Request ---> Often missing a required parameter",
        apiError: "Some Error Occurred"
    },
    401: {
        code: 401,
        message: "Unauthorized ---> No valid API key provided",
        apiError: "Some Error Occurred"
    },
    402: {
        code: 403,
        message: "Request Failed ---> Parameters were valid but request failed",
        apiError: "Some Error Occurred"

    },
    403: {
        code: 403,
        message: "Forbidden ---> The current API does not have access to this method",
        apiError: "Some Error Occurred"
    },
    404: {
        code: 404,
        message: "Not Found ---> The requested item doesn't exist",
        apiError: "Not Found"
    },
    500: {
        code: 500,
        message: "Server errors ---> Something went wrong on PayUmoney's end",
        apiError: "Not Found"
    },
    502: {
        code: 502,
        message: "Server errors ---> Something went wrong on PayUmoney's end",
        apiError: "Not Found"
    },
    503: {
        code: 503,
        message: "Server errors ---> Something went wrong on PayUmoney's end",
        apiError: "Not Found"
    },
    504: {
        code: 504,
        message: "Server errors ---> Something went wrong on PayUmoney's end",
        apiError: "Not Found"
    }
};


module.exports.getRequestError = function (code) {
    return new Error(PayUMoneyErrorCodes[code]);
};