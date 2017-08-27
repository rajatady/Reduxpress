/**
 * Created by SkeTech on 10-10-2016.
 */
var mongoose = require("mongoose");


function Create() {

}

Create.prototype.setRedux = function (redux) {
    this.redux = redux;
};


Create.prototype.model = function (model) {

    if (typeof model == "string") {
        var that = this;
        setTimeout(function () {
            that.model = mongoose.model(model);
        }, 0);
    } else {
        this.model = model;
    }
    return this;
};


Create.prototype.set = function (data) {
    console.log(data);
    this.data = new this.model(data);
    return this;
};


Create.prototype.validate = function () {
    var errors = this.data.validateSync();

    return this;
};


Create.prototype.save = function () {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.data.save()
            .then(function (data) {
                resolve(data);
            })
            .catch(function (err) {
                console.log(err.stack);
                reject(err);
            })
    })
};


module.exports = new Create();