var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();
var mongoDBURI = process.env.MONGODB_URI ||'mongodb://CJV:doritos61@ds231245.mlab.com:31245/heroku_dh2zjfbf';
router.post('/',jsonParser, function(req, res) {
    var requestBody = req.body;
    console.log(requestBody);
    mongodb.connect(mongoDBURI, function(err, db) {
        if(err) throw err;


        var Routes = db.collection('CUSTOMERS');
        var custID = new ObjectID();
        var cust = {
            _id: custID,
            FIRSTNAME: requestBody.fnameB,
            LASTNAME: requestBody.lnameB,
            STREET: requestBody.addressB,
            CITY: requestBody.cityB,
            STATE: requestBody.stateB,
            ZIP: requestBody.zipB,
            EMAIL: requestBody.emailB
        };
        Routes.insertOne(cust, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
        });
        Routes = db.collection('BILLING');
        var billID = new ObjectID();
        var bill = {
            _id: billID,
            CUSTOMERID: custID,
            CREDITCARDTYPE: requestBody.creditCard,
            CREDITCARDNUM: requestBody.cardNumber,
            CREDITCARDEXP: requestBody.cardExpiration,
            CREDITCARDDATE: requestBody.cardExpiration,
            CREDITCARDSECURITYNUM: requestBody.cardSecurityNumber
        }
        Routes.insertOne(bill, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
        });
        Routes = db.collection('SHIPPING');
        var shipID = new ObjectID();
        var ship = {
            _id: shipID,
            SHIPPING_STREET: requestBody.address,
            SHIPPING_CITY: requestBody.city,
            SHIPPING_STATE: requestBody.state,
            SHIPPING_ZIP: requestBody.zip
        }
        Routes.insertOne(ship, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
        });
        Routes = db.collection('ORDERS');
        //only want code, quantity, and price in database
        var products = new Array();
        var totalCost = 0;
        var numItems = (req.body.session_basket).length;
        for (var i =0; i < numItems; i++)
        {
            var item = new Object();
            item.code = requestBody.session_basket[i].code;
            item.quantity = requestBody.session_basket[i].quantity;
            item.price = requestBody.session_basket[i].price;
            totalCost += parseFloat(item.price * item.quantity);
            console.log('totalCost so far ' + totalCost);
            item = JSON.stringify(item);
            products.push(item);
        }
        console.log(totalCost);
        var order = {
            CUSTOMER_ID: custID,
            BILLING_ID: billID,
            SHIPPING_ID: shipID,
            DATE: new Date(),
            PRODUCT_VECTOR: products,
            ORDER_TOTAL: ((totalCost +(totalCost*0.08)) +2).toFixed(2)
        }
        Routes.insertOne(order, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
        });
        //close connection when your app is terminating.
        db.close(function (err) {
            if(err) throw err;
        });

    });//end of connect
    res.render('storeData', { data: requestBody});
});
module.exports = router;