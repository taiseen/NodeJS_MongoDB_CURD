// 24-March-2021 >>>to>>> 26-March-2021

// npm init
// npm install express
// npm install mongodb
// npm install nodemon --save-dev
// npm install cors body-parser --save

// "start" : "nodemon index.js",
// npm i

user = 'dbUser'
pass = 'dbUs3rBD'
//======================================================

// 1) import express in NodeJS
const express = require('express');
const bodyParser = require('body-parser');
//======================================================

// MongoDB Atlas
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://dbUser:dbUs3rBD@cluster0.z9kin.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// 2) create an application...
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//======================================================

// 3) listening this app a dedicate Port Number... 
app.listen(3000);
//======================================================

// 4) check that, creating app working or not... 
app.get('/', (input, output) => {
  //output.send('Hello... MongoDB')
  output.sendFile(__dirname + '/Client_Side/index.html');
})
//======================================================


client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");
  //const product = { name: 'Honey', price: 150, quantity: 20 };
  // productCollection.insertOne(product)
  // .then(res => console.log(res));

  // CURD Operation Area.....

  // CURD ==> "Create" "POST" Operation ==> OK
  app.post('/addProduct', (req, res) => {
    // get data from user....
    const product = req.body;
    console.log(product);
    productCollection.insertOne(product)
      .then(result => {
        console.log("/addProduct : OK");
        res.redirect('/');
      });

    //res.send(`<p>Thanks</p>`);

  });



  // Open API link...
  // CURD ==> "Read" "GET" Operation ==> OK
  app.get('/products', (req, res) => {

    // get data from dataBase & show to user...
    productCollection.find({}) //.limit(3)
      .toArray((err, documents) => {
        res.send(documents);
      });

  });



  // CURD ==> "Delete" "Delete" Operation ==> OK
  app.delete('/delete/:id', (req, res) => {
    // Get the deleted id from user...
    const remove = req.params.id;
    //console.log('Deleted ===> ', remove);

    //ObjectId("remove") 
    productCollection.deleteOne({ _id: ObjectId(remove) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      })
  })




  // CURD ==> "Update" "GET" Operation ==> OK
  app.get('/product/:id', (req, res) => {
    const editData = req.params.id;
    //console.log('Edited ===> ',editData);

    productCollection.find({ _id: ObjectId(editData) })
      .toArray((err, documents) => {

        // send to user clickable data 
        // that user click for update...
        res.send(documents[0]);
      })
  });

  // editable data for update... 
  app.patch('/update/:id', (req, res) => {
    console.log(req.body);
    const editableData = req.params.id;
    productCollection.updateOne({ _id: ObjectId(editableData) },
      {
        $set: {
          name: req.body.name,
          price: req.body.price,
          quantity: req.body.quantity,
        }
      })
      .then(result => {
        res.send(result.modifiedCount > 0);
      });

  });



  console.log('DataBase Connected...');

  //client.close();
  // End of Program...
});
