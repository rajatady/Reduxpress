/**
 * Created by kumardivyarajat on 24/09/16.
 */
var request = require("request");
var Promise = require("bluebird");
const queryString = require('query-string');

function Bhash(user, password, sender, priority, stype) {
    this.user = user;
    this.password = password;
    this.sender = sender;
    this.priority = priority;
    this.stype = stype;
}

Bhash.prototype._getBaseUrl = function (type) {
    var urls = {
        sendMsg: "http://bhashsms.com/api/sendmsg.php",
    };


    return urls[type];
};

Bhash.prototype.sendSingle = function (mobile, message) {
    var baseUrl = this._getBaseUrl("sendMsg");

    this.phone = mobile;
    this.text = message;
    const stringify = queryString.stringify(this);
    console.log(stringify);
    console.log(baseUrl + "?" + stringify);
    this._request(baseUrl + "?" + stringify);
};


// http://bhashsms.com/api/sendmsg.php?user=reduxpress&pass=********&sender=Sender ID&phone=Mobile No&text=Test SMS&priority=Priority&stype=smstype
Bhash.prototype._request = function (url) {

    request(url, function (error, response, body) {
        console.log(body);
    })
};

module.exports = Bhash;