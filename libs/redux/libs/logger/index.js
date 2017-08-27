/**
 * Created by kumardivyarajat on 22/09/16.
 */
var chalk = require("chalk");
var _ = require("lodash");
require("console.table");
var utils = require("../utils/index");
var mongoose = require("mongoose");

/***
 * @memberOf Logger
 * @param title
 * @param msg
 * @param returnData
 */
module.exports.console = function (title, message, returnData) {
    if (message) {
        if (message.validate) {
            message = message.toObject();
        }
        var data = buildMessage(title, message);
        print(data.head, data.message, data.footer);
        if (returnData) {
            return data;
        }
    }
};

var buildMessage = function (title, message) {
    var data = {
        head: "",
        message: "",
        footer: ""
    };
    title = title.toUpperCase();
    data.head = "******************************* " + title + " ****************************************" + "\n";
    data.message = message;
    data.footer = "*******************************" + buffer(title) + "****************************************" + "\n";

    return data;
};

var print = function (head, message, footer) {
    console.log(head);
    if (Array.isArray(message)) {
        printArray(message);
    } else if (utils.isObject(message)) {
        printObject(message);
    } else {
        console.log(typeof message, message);
    }
    console.log(footer);
};

/***
 * @memberOf Logger
 * @param error
 */
module.exports.error = function (error) {
    var title = "Error";
    console.log("******************************* " + title.toUpperCase() + " ****************************************");
    if (error instanceof Error) {
        printError(error);
    } else {
        console.log(typeof message, message);
    }
    console.log("*******************************" + buffer(title) + "****************************************");
};


module.exports.info = function (message) {
    console.log(chalk.blue("[info] " + message));
};


module.exports.warn = function (message) {
    console.log(chalk.yellow("[warn] " + message));
};


module.exports.errorLine = function (message) {
    console.log(chalk.bold.red("[error] " + message));
};

var printArray = function (array) {
    _.forEach(array, function (o, i) {
        console.log(" ------------------------------ " + (i + 1) + ". -----------------------------------");
        console.log(o);
        console.log(" ------------------------------" + buffer(i + 1) + "-------------------------------------");
    })
};


var printObject = function (obj) {
    // var object = {};
    // object = _.defaultsDeep(obj, object);
    var object = {};
    object = _.assignIn(object,obj);
    if (object instanceof mongoose.Schema) {
        object = object.toObject();
    }

    _.forOwn(object, function (value, key) {
        if (typeof value == "string") {
            if (value.length > 100) {
                value = value.slice(0, 97) + "... ";
                object[key] = value;
            }
        }
    });
    console.table(object);
};


var printError = function (error) {
    console.log(error.stack);
};


var buffer = function (title) {
    var str = "";
    for (var i = 0; i <= title.length + 2; i++) {
        str += "*";
    }
    return str;
};
