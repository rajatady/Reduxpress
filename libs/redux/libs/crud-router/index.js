/**
 * Created by SkeTech on 10-10-2016.
 */
var router = require("express").Router();
var Create = require("./libs/create/middleware");
var Get = require("./libs/get/middleware");

function Crud() {
    this.entity = {};
}


Crud.prototype.setRouter = function (router) {
    this.entity.router = router;
    return this;
};

/**
 * @memberOf Crud#
 * @param route
 * @param schema
 * @returns {Crud}
 */
Crud.prototype.setEntity = function (route, schema) {
    this.entity.route = route;
    this.entity.model = schema;
    if (!this.entity.router) {
        this.entity.router = router;
    }
    return this;
};

/**
 * @memberOf Crud#
 * @param secured
 * @param options
 * @returns {Crud}
 */
Crud.prototype.create = function (secured, options) {
    this.create = {};
    this.create.isSecured = true;
    this.create.isAllowed = true;
    this.create.options = options;
    return this;
};


Crud.prototype.get = function (secured, options) {
    this.get = {};
    this.get.isSecured = true;
    this.get.isAllowed = true;
    this.get.options = options;
    return this;
};

/**
 * @memberOf Crud#
 * @returns {*}
 */
Crud.prototype.router = function () {

    if (this.create.isAllowed) {
        this.entity.router.post("/" + this.entity.route, Create(this.entity).create);
    }

    if (this.get.isAllowed) {
        var get = new Get().getMiddleware(this.entity);
        this.entity.router.get("/" + this.entity.route + "/:id", get.getSingle);
        this.entity.router.get("/" + this.entity.route, get.getAll);
    }
    return this.entity.router;
};


module.exports = Crud;