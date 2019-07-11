/**
 * Created by kumardivyarajat on 24/08/16.
 */

var errors = {
    //General Errors
    300: "Invalid Quantity",
    301: "Query Parameters Missing",

    404: "Not Found",

    // Request related Error codes
    409: "Some parameters missing",
    410: "Invalid OTP",
    411: "Invalid Params",
    413: "Token Expired",

    //Login Related Errors
    403: "Invalid Token Provided",
    420: "Invalid Mobile Number",
    421: "Invalid Email ",
    422: "Invalid Password",
    423: "Invalid Mobile/Password",


    // Registration related Error codes
    430: "10 digit mobile Number is required",
    431: "Mobile Number Already Taken",
    432: "Invalid Email ID",
    433: "Email Already Taken",
    434: "Password Too Short",
    435: "User Already Registered",
    436: "Mobile Number Not Registered",
    437: "Invalid OTP",
    438: "Passwords do not match",

    // Coupon Errors
    441: "Invalid Coupon",
    442: "Coupon Expired",
    443: "Product Not Eligible",
    444: "User not eligible",

    //Cart Errors
    460: "Cart Not Found",
    461: "Product Already In Cart",
    462: "Item Not Found",

    // Abstracted Errors
    500: "Invalid Server Error",

    //Order Errors
    600: "Invalid Payment Mode",
    611: "Shipment hasn't been shipped yet",

    //
    800: "Critical Error"


};

var error = {
    _findError: function (code) {
        return errors[code];
    },
    generateNewError: function (code, message) {
        if (!code || this._findError(code) === "undefined") {
            code = 500;
        }
        var errorMessage = this._findError(code);
        var err = new Error();
        err.code = code;
        if (message) {
            err.message = message;
        } else if (errorMessage) {
            err.message = errorMessage;
        } else {
            err.message = "Internal Server Error";
        }
        return err;
    },
    injectError: function (errObject) {
        errors = errObject;
    }
};

module.exports = error;