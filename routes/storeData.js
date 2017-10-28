var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json()
var mongoDBURI = process.env.MONGODB_URI ||'mongodb://CJV:doritos61@ds231245.mlab.com:31245/heroku_dh2zjfbf';

router.post('/',urlencodedParser, function(req, res) {
    console.log("testing req");
    console.log(req.body);
    console.log("testing req.body.field1");
    console.log(req.body.field1);
    res.render('index', { title: req.body.field1});
});

module.exports = router;