const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors())
app.use(express.json());



// mongo db uri link 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dvdmb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('arTourxWebsite')
        const packageCollection = database.collection('packages');
        const travellerCollection= database.collection('travellers');
        const bookingCollection= database.collection('bookings');

        //Get Packages API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        //Get single data
        app.get('/packages/:id', async (req, res) => {
             const result = await packageCollection.findOne({_id: ObjectId(req.params.id)});
            res.send(result);
        })

        //Get Traveller API
        app.get('/travellers', async(req, res) => {
            const cursor = travellerCollection.find({});
            const travellers = await cursor.toArray();
            res.send(travellers);
        })

        //Add Booking 
        app.post("/booking", async (req, res) =>{
            console.log(req.body);
            const result = await bookingCollection.insertOne(req.body);
            res.send(result);
        })
        //My Orders
        app.get("/myOrder/:email", async (req, res) => {
            const result = await bookingCollection.find({email: req.params.email}).toArray();
            res.send(result);
       
        })

        //My Orders Delete method
        app.delete("/deleteOrder/:id", async(req, res) => {
            const result = await bookingCollection.deleteOne({_id:ObjectId(req.params.id)})
            res.send(result);
        })

        //All Orders
        app.get("/allOrders", async(req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.send(result);
            // console.log(result);
        })

        //All Orders Delete method
        app.delete("/deleteOrders/:id", async(req, res) => {
            const result = await bookingCollection.deleteOne({_id:ObjectId(req.params.id)})
            res.send(result);
        })

      

    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);


app.get ('/', (req, res) => {
    res.send('Ar tourx server is running')
});

app.get('/hello', (req, res) => {
    res.send('hello updated here')
})

app.listen(port, () => {
    console.log('Server running at port', port)
})