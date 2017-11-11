var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var ControllerMain = require('../controllers/database');
/* GET home page. */
router.get('/',ControllerMain.index);
router.post('/storeData', ControllerMain.storeData);

module.exports = router;
