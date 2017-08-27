/**
 * Created by kumardivyarajat on 22/09/16.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var reduxSchema = new Schema({
    route: String,
    ipAddress: String,
    version: String,
    trace: [],
    method: String,
    userAgent: String,
    appAgent: String,
    accessToken: String,
    accessTokenHash: String,
    refreshToken: String,
    resolved: {type: Boolean, default: false},
    ttr: {type: Number}
}, {timestamps: true});


var Request = mongoose.model('ReduxTrace', reduxSchema);
module.exports = Request;
