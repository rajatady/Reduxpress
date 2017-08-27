/**
 * Created by kumardivyarajat on 06/10/16.
 */

var _ = require("lodash");

function CRUD() {
}


CRUD.prototype.model = function (model) {
    this.model = model;
    return this;
};

CRUD.prototype.lean = function () {
    this.lean = true;
    return this;
};

CRUD.prototype.query = function (query) {
    this.query = query;
    return this;
};

CRUD.prototype.limit = function (limitValue) {
    this.limit = limitValue;
    return this;
};

CRUD.prototype.get = function () {
    var that = this;
    var query;
    return new Promise(function (resolve, reject) {

        if (that.query) {
            query = that.model.find(that.query);
        } else {
            query = that.model.find();
        }

        if (that.limit) {
            query = query.limit(that.limit);
        }

        if (that.lean) {
            query = query.lean();
        }


        query.exec()
            .then(function (data) {
                resolve(data);
            })
            .catch(function (err) {
                reject(err);
            })
    })
};


CRUD.prototype.create = function (data) {

    var that = this;

    return new Promise(function (resolve, reject) {
        var model = new that.model(data);

        var error = model.validateSync();
        var errorMessages = [];
        if (error) {
            _.forEach(error.errors, function (err) {
                if (err.message) {
                    errorMessages.push({error: err.message});
                } else {
                    errorMessages.push({error: "Required param " + err.path + " is missing."})
                }
            });
            var err = new Error();
            err.message = errorMessages;
            err.code = 409;
            reject(err);
        } else {
            model.save()
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err);
                });
        }
    });

};


module.exports = new CRUD();