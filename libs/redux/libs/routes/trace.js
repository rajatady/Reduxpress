/**
 * Created by kumardivyarajat on 10/10/16.
 */
var Model = require("../../model");

function Trace() {
    this.model = Model;
    this.defaultLimit = 50;
}


Trace.prototype.getAllTraces = function (query, cursor, select) {
    return Model.find(query, select, cursor)
};


module.exports = new Trace();