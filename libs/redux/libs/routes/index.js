/**
 * Created by kumardivyarajat on 10/10/16.
 */
var Traces = require("./trace");


module.exports = {
    getAllTraces: function (request, response) {
        var redux = request.redux;

        redux
            .invokeAcl("admin")
            .interceptor(request, ["^offset"], "params")
            .then(function (data) {
                return Traces.getAllTraces(data.offset);
            })
            .then(function (traces) {
                redux.log(traces, "getAllTraces");
                redux.sendSuccess(response, traces, "traces");
            })
            .catch(function (err) {
                redux.error(err);
                redux.sendError(response, err);
            })
    }
};