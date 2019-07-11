/**
 * Created by kumardivyarajat on 10/10/16.
 */
var Traces = require("./trace");


module.exports = {
    getAllTraces: function (request, response) {
        var redux = request.redux;
        var query = request.querymen.query, cursor = request.querymen.cursor, select = request.querymen.select;
        if (cursor.limit && request.query.page) {
            cursor.skip = cursor.limit * (request.query.page - 1)
        }
        redux
            .invokeAcl("admin")
            .tokenValidator(request)
            .then(function (data) {
                return Traces.getAllTraces(query, cursor, select);
            })
            .then(function (traces) {
                redux.log(traces, "getAllTraces");
                redux.sendSuccess(response, traces, "traces");
            })
            .catch(function (err) {
                redux.err(err);
                redux.sendError(response, err);
            })


    }
};
