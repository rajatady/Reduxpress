/**
 * Created by kumardivyarajat on 10/10/16.
 */
var router = require("express").Router();
var Ctrl = require("./libs/routes/index");

router.get("/:offset",Ctrl.getAllTraces);


module.exports = router;