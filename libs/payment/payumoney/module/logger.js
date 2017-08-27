/**
 * Created by kumardivyarajat on 15/09/16.
 */


var logger = function (loggingIsEnabled) {
    this.loggingEnabled = loggingIsEnabled;
};


logger.prototype._printLogHeader = function () {
    if (this.loggingEnabled)
        console.log("********************************* PayUMoney *********************************");
};


logger.prototype._printLogFooter = function () {
    if (this.loggingEnabled)
        console.log("******************************************************************************");
};


logger.prototype._printRequestUrl = function (url, method) {
    if (this.loggingEnabled)
        console.log("Request" + new Date().now() + "  " + method + "    ----> " + url);
};