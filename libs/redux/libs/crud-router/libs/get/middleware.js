/**
 * Created by kumardivyarajat on 12/10/16.
 */

var Get = require("./get");

var GetMiddleWare = function () {

};


GetMiddleWare.prototype.getMiddleware = function (entity) {
    // console.log(entity);
    // var m = entity.model.model('Customisation');
    //
    Get = Get.model(entity.model);
    // console.log(Get);

    return {
        /**
         * @author - Kumar Divya Rajat
         * @createdAt - 12/10/16
         * @route - /api/v1/[entity.route]/:id
         * @method - GET
         * @description - Generic route handler to get a single resource by id
         **/
        getSingle: function (request, response) {
            var redux = request.redux;

            redux.paramsValidator(request, ["id"])
                .then(function (data) {
                    // Logger.console("paramsValidator", data);
                    return Get.getSingleById(data.id);
                })
                .then(function (result) {
                    redux.log(result, entity.route);
                    redux.sendSuccess(response, result, entity.route);
                })
                .catch(function (err) {
                    redux.error(err);
                    redux.sendError(response, err);
                })
        },


        /**
         * @author - Kumar Divya Rajat
         * @createdAt - 12/10/16
         * @route - /api/v1/[entity.route]
         * @method - GET
         * @description - Generic route handler to fetch all resources of type [entity.model].
         **/
        getAll: function (request, response) {
            var redux = request.redux;
            Get.getAll()
                .then(function (result) {
                    redux.log(result, entity.route);
                    redux.sendSuccess(response, result, entity.route);
                })
                .catch(function (err) {
                    redux.error(err);
                    redux.sendError(response, err);
                })
        }
    }
};


module.exports = GetMiddleWare;

