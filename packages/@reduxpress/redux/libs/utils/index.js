/**
 * Created by kumardivyarajat on 23/09/16.
 */

var mongoose = require('mongoose'),
    err = require('../error/index');

module.exports.isObject = function (value) { /* Requires ECMAScript 6 or later */
    try {
        Object.setPrototypeOf({}, value);
        return value !== null;
    } catch (err) {
        return false;
    }
};


module.exports.validateId = function (data) {
    var self = this;
    return new Promise(function (resolve) {
        if (self.isArray(data)) {
            data.forEach(function (id) {
                if (!(mongoose.Types.ObjectId.isValid(id) && mongoose.Types.ObjectId.isValid(id))) {
                    throw err.generateNewError(411);
                }

            });
            resolve(data);
        } else {
            if (!(mongoose.Types.ObjectId.isValid(data) && mongoose.Types.ObjectId.isValid(data))) {
                throw err.generateNewError(411);
            } else {
                resolve(data);
            }
        }
    })

};
module.exports.isArray = function (message) {
    return Array.isArray(message);
};


module.exports.merge_options = function (obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
        obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname];
    }
    return obj3;
};
