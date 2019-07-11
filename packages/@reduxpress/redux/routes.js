/**
 * Created by kumardivyarajat on 10/10/16.
 */
var router = require("express").Router();
var Ctrl = require("./libs/routes/index");
var querymen = require('querymen');

router.get("/:offset",
    querymen.middleware(),
    Ctrl.getAllTraces);


module.exports = router;