var mongodb = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var mongoDBURI = process.env.MONGODB_URI ||'mongodb://CJV:doritos61@ds231245.mlab.com:31245/heroku_dh2zjfbf';
//default page
module.exports.index = function(req, res, next) {
    res.render('index', { title: 'Express' });
};
module.exports.storeData = function(req, res) {
    var requestBody = req.body;
    //console.log(requestBody);
    mongodb.connect(mongoDBURI, function(err, db) {
        if(err) throw err;
        //dbColl represents current database collection
        var dbColl = db.collection('CUSTOMERS');
        // create IDs for new documents
        var custID = new ObjectID();
        var billID = new ObjectID();
        var shipID = new ObjectID();
        //create customer JSON
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
        //Insert document and set collection to billing
        dbColl.insertOne(cust,processRequest);
        dbColl = db.collection('BILLING');
        //create billing JSON
        var bill = {
            _id: billID,
            CUSTOMERID: custID,
            CREDITCARDTYPE: requestBody.creditCard,
            CREDITCARDNUM: requestBody.cardNumber,
            CREDITCARDEXP: requestBody.cardExpiration,
            CREDITCARDSECURITYNUM: requestBody.cardSecurityNumber
        };
        //Insert document and set collection to shipping
        dbColl.insertOne(bill,processRequest);
        dbColl = db.collection('SHIPPING');
        //create shipping JSON
        var ship = {
            _id: shipID,
            CUSTOMER_ID: custID,
            SHIPPING_STREET: requestBody.address,
            SHIPPING_CITY: requestBody.city,
            SHIPPING_STATE: requestBody.state,
            SHIPPING_ZIP: requestBody.zip
        };
        //Insert document and set collection to orders
        dbColl.insertOne(ship,processRequest);
        dbColl = db.collection('ORDERS');
        //create product vector
        var products = new Array();
        var totalCost = 0;
        for (var i =0; i < requestBody.session_basket.length; i++)
        {
            //only want code, quantity, and price in database
            var item = new Object();
            item.code = requestBody.session_basket[i].code;
            item.quantity = requestBody.session_basket[i].quantity;
            item.price = requestBody.session_basket[i].price;
            totalCost += parseFloat(item.price * item.quantity);
            //add item as JSON
            item = JSON.stringify(item);
            products.push(item);
        }
        //create order JSON
        var order = {
            CUSTOMER_ID: custID,
            BILLING_ID: billID,
            SHIPPING_ID: shipID,
            DATE: new Date(),
            PRODUCT_VECTOR: products,
            ORDER_TOTAL: ((totalCost +(totalCost*0.08)) +2).toFixed(2)
        };
        //insert document
        dbColl.insertOne(order,processRequest);
        //close connection
        db.close(function (err) {
            if(err) throw err;
        });

    });//end of connect
    //render order summary
    res.render('storeData', { data: requestBody});
};

function processRequest(err, res)
{
    if (err) throw err;
    console.log("1 document inserted");
}