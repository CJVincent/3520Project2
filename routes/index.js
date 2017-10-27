var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI ||'mongodb://CJV:doritos61@ds231245.mlab.com:31245/heroku_dh2zjfbf';
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/', function(req, res, next) {
    res.render('index', { title: 'ExpressPost' });
});
router.all('/secret', function(req, res, next) {
    res.render('index', { title: 'Express2' });
});
router.get('/mongodb', function (request, response) {
    mongodb.MongoClient.connect(mongoDBURI, function(err, db) {
        if(err) throw err;

        //get collection of routes
        var Routes = db.collection('CUSTOMERS');

        //get all Routes
        Routes.find({ }).sort({ name: 1 }).toArray(function (err, docs) {

            if(err) throw err;

            response.render('mongodb', {title: docs});

        });

        //close connection when your app is terminating.
        db.close(function (err) {
            if(err) throw err;
        });

    });//end of connect


});//end XXX.get
module.exports = router;
