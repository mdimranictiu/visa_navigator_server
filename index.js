require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nu3ic.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// middleware
app.use(express.json());
app.use(cors());




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();

    const visaCollection=client.db('visaDB').collection('visas');
    const applyCollection=client.db('visaDB').collection('applications');
// addvisa
    app.post('/addvisa', async (req,res)=>{
      const newVisa= req.body;
    console.log(newVisa);
    const result= await visaCollection.insertOne(newVisa);
    res.send(result);
    })
    app.post('/addapplication', async (req,res)=>{
      const newApply= req.body;
    console.log(newApply);
    const result= await applyCollection.insertOne(newApply);
    res.send(result);
    })
    app.get('/Allvisas', async(req,res)=>{
      const cursor= visaCollection.find();
      const result= await cursor.toArray()
      res.send(result);
      
     })
    app.get('/Allvisas/:id', async(req,res)=>{
      const id= req.params.id;
       const query={_id: new ObjectId(id)};
      const result= await visaCollection.findOne(query)
      res.send(result);
      
     })
   
    app.get('/myapplication/', async(req,res)=>{
      const email = req.query.email;
      const query = { email: email };
      const result= await applyCollection.find(query).toArray();
      res.send(result);
     
      
     })
    app.get('/myapplication/:id', async(req,res)=>{
      const id= req.params.id;
       const query={_id: new ObjectId(id)};
      const result= await applyCollection.findOne(query)
      res.send(result);
     })

     app.delete('/myapplication/:id', async(req,res)=>{
      const id= req.params.id;
      const query={_id: new ObjectId(id)};
      const result= await applyCollection.deleteOne(query);
      res.send(result);
      
     })
     app.delete('/Allvisas/:id', async(req,res)=>{
      const id= req.params.id;
      const query={_id: new ObjectId(id)};
      const result= await visaCollection.deleteOne(query);
      res.send(result);
      
     })
  // to get myallvisa
    app.get('/myallvisa/', async(req,res)=>{
      const email = req.query.email;
      const query = { email: email };
      const result= await visaCollection.find(query).toArray();
      res.send(result);
      
     })

     // update 

     app.put('/Allvisas/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
          $set: req.body
      }

      const result = await visaCollection.updateOne(filter, updatedDoc, options)

      res.send(result);
  })
// latest visa 
  app.get('/latestVisa', async (req, res) => {
    try {
        const cursor = visaCollection.find().sort({ _id: -1 }).limit(6);
        const result = await cursor.toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching latest visas:", error);
    }
});















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,(req,res)=>{
    console.log(`My server is running http://localhost:${port}`)
})