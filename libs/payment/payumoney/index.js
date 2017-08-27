/**
 * Created by kumardivyarajat on 05/09/16.
 */
var express = require('express');
var router = express.Router();
var PayUMoneyCtrl = require('./controller');
var auth = require("../../auth/routes.js");


router.post("/accept", PayUMoneyCtrl.handlePayment)
    .post("/reject", PayUMoneyCtrl.handlePayment);


router.use(auth.verifyToken);

router
    .post("/details", PayUMoneyCtrl.generateHash)
    .post('/receive',PayUMoneyCtrl.verifyPayment);


module.exports = router;