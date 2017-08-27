/**
 * Created by kumardivyarajat on 10/10/16.
 */
var Model = require("../../model");

function Trace() {
    this.model = Model;
    this.defaultLimit = 50;
}


Trace.prototype.getAllTraces = function (offset, limit) {
    var that = this;
    return new Promise(function (resolve, reject) {
        var skip;
        if (!limit) {
            limit = that.defaultLimit;
        }

        offset = ( offset - 1) * limit;
        Logger.console("Limit", limit);
        Logger.console("Offset", offset);
        Model
            .find({})
            .limit(limit)
            .skip(offset)
            .sort({createdAt: -1})
            .exec()
            .then(function (traces) {
                resolve(traces);
            })
            .catch(function (err) {
                reject(err);
            })
    })
};


module.exports = new Trace();