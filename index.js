const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ooo4k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
     await client.connect();
     const database = client.db("tourmama");
    const packageCollection = database.collection("packages");
  
    //get all packages api
    app.get("/allpackages", async (req, res) => {
        const cursor = packageCollection.find({});
        const packages = await cursor.toArray();
        res.send(packages);
      });


       // add a package
    app.post("/addpackage", async (req, res) => {
      const newPack = req.body;
      const result = await packageCollection.insertOne(newPack);
      console.log("got new pack", req.body);
      console.log("successfully added pack", result);
      res.json(result);
    });






    console.log('connected to tourmama database');
  }
  finally{
    //   await client.close()
  }
}
run().catch(console.dir)

app.get('/', (req,res) => {
    res.send('Running Tourmama Server')
})

app.listen(port, () => {
    console.log('Listening to Tourmama server on', port);
})