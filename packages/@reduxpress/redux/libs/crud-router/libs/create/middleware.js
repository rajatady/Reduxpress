/**
 * Created by SkeTech on 10-10-2016.
 */
var Create = require("./create");


module.exports = function (entity) {
    // console.log("Create -> ", entity);

    return {
        create: function (request, response) {

            var redux = request.redux;

            // var data = request.body[entity.route];
            redux.bodyValidator(request, entity.model)
                .then(function (data) {
                    redux.log(data, "bodyValidator");
                    // return Create
                    //     .setRedux(redux)
                    //     .model(entity.model)
                    //     .set(data)
                    //     .save();
                    return data.save();
                })
                .then(function (result) {
                    redux.log(result, entity.route);
                    redux.sendSuccess(response, result, entity.route);
                    // var res = {};
                    // res[entity.route] = result;
                    // response.status(200).json(res);
                })
                .catch(function (err) {
                    redux.error(err);
                    redux.sendError(response, err);
                })
        }
    }
};