var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var session = reqruie('express-session');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mongoDBURI = process.env.MONGODB_URI ||'mongodb://CJV:doritos61@ds231245.mlab.com:31245/heroku_dh2zjfbf';

router.post('/',urlencodedParser, function(req, res) {
    console.log(req.body);
    res.render('index', { title: req.body.field1});
});

module.exports = router;