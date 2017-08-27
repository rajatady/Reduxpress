/**
 * Created by M-Rayees on 10/28/2016.
 */

var request = require('request');
var OrderModel = require("../../../modules/order/lib/order.model.js");
var _ = require("lodash");
// request.debug = true;
// require('request-debug')(request);
//Demo Wrapper Library for KartRocket
function ShipRocket(key) {
    this.key = "&key=" + key;
    this.version = "&version=2";
    this.endPoints = {
        base: "http://reduxpress.kartrocket.co/",
        common: "index.php?route=feed/web_api/",
        category: "category",
        categories: "categories",
        addProduct: "addproduct",
        product: "product",
        products: "products",
        order: 'orders',
        addOrder: "addorder",
        updateOrder: "updateorders",
        shipmentUrl: "http://api.shiprocket.in/public/shipping/track/awb?val="
    };

    this.getBase = function () {
        return this.endPoints.base + this.endPoints.common;
    };

    this.categoryUrl = function () {
        return this.getBase() + this.endPoints.category + this.key;
    };

    this.categoriesUrl = function () {
        return this.getBase() + this.endPoints.category + this.key;
    };

    this.orderUrl = function () {
        return this.getBase() + this.endPoints.order + this.key;
    };

    this.productUrl = function () {
        return this.getBase() + this.endPoints.product + this.key;
    };

    this.productsUrl = function () {
        return this.getBase() + this.endPoints.products + this.key;
    };

    this.addOrderUrl = function () {
        return this.getBase() + this.endPoints.addOrder + this.version + this.key;
    };

    this.updateOrderUrl = function () {
        return this.getBase() + this.endPoints.updateOrder + this.key;
    };

    this.trackShipmentUrl = function () {
        return this.endPoints.shipmentUrl;
    };

    this.getProductFields = function () {
        //function To Be Used Outside Library
        return {
            name: "",
            model: "",
            sku: "",
            quantity: "",
            subtract: "",
            price: "",
            total: "",
            tax: "",
            reward: ""
        };
    };
    this.getTotalsFields = function () {
        //function To Be Used Outside Library
        return {
            handling: "",
            low_order_fee: "",
            sub_total: "",
            tax: "",
            total: ""
        };
    };
    this.order = {
        import_order_id: undefined,
        firstname: undefined,
        lastname: undefined,
        email: undefined,
        company: undefined,
        address_1: undefined,
        address_2: undefined,
        city: undefined,
        postcode: undefined,
        state: undefined,
        country_code: undefined,
        telephone: undefined,
        mobile: undefined,
        fax: undefined,
        payment_method: undefined,
        payment_code: undefined,
        shipping_method: undefined,
        shipping_code: undefined,
        order_status_id: undefined,
        products: [],
        totals: {},
        weight: undefined,
        weight_unit: undefined,
        comment: undefined,
        total: undefined
    }
}

ShipRocket.prototype = {
    //private function common caller
    _caller: function (url, method, callback, data) {
        //return Promise
        return new Promise(function (resolve, reject) {
            //External Call To Kartrocket API
            console.log("URL", url);
            console.log("data", data);
            request({
                method: method,
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data,
                json: true
            }, function (error, result, body) {
                console.log(error, body);
                if (error) {
                    if (typeof callback === "function")
                        callback(error);
                    reject(error);
                }
                if (result.statusCode === 200 || result.statusCode === 201) {
                    if (typeof callback === "function")
                        callback(null, result, body);
                    resolve(body)
                }
            });
        });
    },
    getCategory: function (id, callback) {
        if (!id)
            throw new Error("Category Id Required");
        var url = this.categoryUrl() + '&id=' + id;
        return this._caller(url, "GET", callback);
    },
    getCategories: function (parent, level, callback) {
        var url = this.categoriesUrl();
        if (parent)
            url += '&parent=' + parent;
        if (level)
            url += '&level=' + parent;
        return this._caller(url, "GET", callback);
    },
    getProduct: function (id, sku, callback) {
        var url = this.categoryUrl();
        if (id)
            url += '&id=' + id;
        if (sku)
            url += '&sku=' + sku;
        return this._caller(url, "GET", callback);

    },
    getProducts: function (category, page, callback) {
        var url = this.categoryUrl();
        if (category)
            url += '&category=' + category;
        if (page)
            url += '&page=' + page;
        return this._caller(url, "GET", callback);

    },
    getOrders: function (page, callback) {
        var url = this.orderUrl();
        if (page)
            url += '&page=' + page;
        return this._caller(url, "GET", callback);
    },
    getOrderById: function (id, callback) {
        var url = this.orderUrl();
        if (!id)
            throw new Error("Order Id Required");
        url += '&order_id=' + id;
        return this._caller(url, "GET", callback);
    },
    getOrdersByDate: function (from, to, callback) {
        var url = this.orderUrl();
        if (!(from && to))
            throw new Error("Date(s) are missing");

        url += '&date_from=' + from + '&date_to' + to;
        return this._caller(url, "GET", callback);
    },
    generateOrder: function (order) {
        console.log("generateOrder", order);
        var self = this;
        return new Promise(function (resolve, reject) {
            self._getOrder(order.orderNumber)
                .then(function (order) {
                    var data = {
                        import_order_id: order.orderNumber,
                        firstname: _.toUpper(order.address.name),
                        email: order.user.email,
                        address_1: _.toUpper(order.address.streetAddress),
                        address_2: _.toUpper(order.address.landmark),
                        city: _.toUpper(order.address.city),
                        postcode: order.address.pinCode,
                        state: _.toUpper(order.address.state),
                        country_code: "IN",
                        mobile: order.address.mobile.match(/\d+/g)[0],
                        payment_method: self._getPaymentModeString(order.paymentMode),
                        payment_code: order.paymentMode === 1 ? "cod" : self._getPaymentModeString(order.paymentMode),
                        // shipping_method: "Aramex",
                        // shipping_code: "Aramex",
                        order_status_id: "1",
                        products: [
                            // {
                            //     name: "Apple iPhone 6Sx",
                            //     model: "MB0010",
                            //     sku: "MB0010",
                            //     quantity: "1",
                            //     subtract: "1",
                            //     price: "145",
                            //     total: "145",
                            //     tax: "6.90",
                            //     reward: "0"
                            // }
                        ],
                        totals: {
                            handling: "44",
                            // low_order_fee: "77",
                            sub_total: "145",
                            // tax: "7",
                            total: '266.50'
                        },
                        weight: (0.3 * order.orderData.products.length).toString(),
                        weight_unit: "kg",
                        comment: "",
                        total: "266.50"
                    };

                    data.products = order.orderData.products.map(function (productData) {
                        return {
                            name: _.startCase(_.toLower(productData.product.name)),
                            sku: productData.product.sku,
                            quantity: productData.quantity.toString(),
                            price: productData.price.toString(),
                            total: productData.totalPrice.toString(),
                            tax: (0.15 * productData.totalPrice).toString(),
                            reward: "0"
                        }
                    });

                    if (order.orderData.shippingCharges > 0) {
                        data.totals.handling = order.orderData.shippingCharges;
                    } else {
                        data.totals.handling = "0";
                    }


                    if (order.orderData.discountAmount > 0) {
                        data.totals.sub_total = order.orderData.subtotal;
                        if (order.orderData.creditDiscount > 0) {
                            data.totals.discount = order.orderData.discountAmount + order.orderData.creditDiscount;
                        } else {
                            data.totals.discount = order.orderData.discountAmount;
                        }
                    } else {
                        data.totals.sub_total = order.amount;
                    }

                    data.totals.total = order.amount;
                    data.total = order.amount;

                    var url = self.addOrderUrl();
                    return self._caller(url, "POST", null, data);
                })
                .then(function (data) {
                    if(data.success) {
                        resolve(data.order_added.order_id);
                    } else {
                        reject(new Error(data.error))
                    }
                })
                .catch(function (err) {
                    reject(err);
                })
        });

    },

    _getOrder: function (orderNumber) {
        return OrderModel.getSingleAdminOrder(orderNumber);
    },


    updateOrder: function (id, status, company, awbNumber, callback) {
        var url = this.updateOrderUrl();
        var err = [];
        var data = {
            "id": id,
            "status": status,
            "company": company
        };
        for (var prop in data) {
            if (!data[prop]) {
                var msg = prop + "Is Missing";
                err.push(msg);
            }
        }

        if (err.length)
            throw new Error("Error");

        if (awbNumber)
            url += "&awb_number=" + awbNumber;

        url += "&order_id=" + id + "&order_status_id" + status + "&courier_company=" + company;
        return this._caller(url, "GET", callback);
    },


    trackShipment: function (awbcode, callback) {
        var url = this.trackShipmentUrl() + awbcode;
        var err = [];
        console.log("Full Url is " + url);
        return this._caller(url, "GET", callback);
    },

    _getPaymentModeString: function (value) {
        switch (value) {

            case 1:
                return "Cash On Delivery";

            case 2 :
                return "Instamojo";

            case 3:
                return "PayUmoney";

            case 4 :
                return "PayTm";

            case 5 :
                return "FreeCharge";

            case 6 :
                return "MobiKwik";
        }
    }
};

module.exports = ShipRocket;