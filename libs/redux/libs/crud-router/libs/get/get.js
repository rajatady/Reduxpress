var mongoose = require("mongoose");
/**
 * Created by SkeTech on 11-10-2016.
 */
function Get() {

}


// Get.prototype.setRedux = function (redux) {
//     this.redux = redux;
// };


Get.prototype.model = function (model) {
    //
    // if (typeof model == "string") {
    //     var that = this;
    //     that.model = mongoose.model(model);
    // } else {
    this.model = model;
    // }
    return this;
};


Get.prototype.getSingleById = function (id) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.model.findById(id)
            .exec()
            .then(function (result) {
                resolve(result);
            })
            .catch(function (err) {
                reject(err);
            })
    })
};


Get.prototype.getAll = function () {

    var that = this;
    return new Promise(function (resolve, reject) {

        that.model.find()
            .exec()
            .then(function (result) {
                resolve(result);
            })
            .catch(function (err) {
                reject(err);
            })
    })
};


module.exports = new Get();