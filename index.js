const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const port=process.env.PORT||5000;
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cen4a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const itemsCollection=client.db("warehouse").collection("itemsCollection");

        //Get Items of Load Items
        app.get('/items',async(req,res)=>{
            const query={};
            const cursor=itemsCollection.find(query);
            const items=await cursor.toArray();
            res.send(items);
        })

        //Get 1 Item
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.findOne(query);
            res.send(result);
        })

        //Add  new  Item
        app.post('/items',async(req,res)=>{
            const newItem=req.body;
            const result =await itemsCollection.insertOne(newItem);
            res.send(result);
        })

        //Update Item Quantity
        app.put('/items/:id', async(req,res)=>{
            const id=req.params.id;
            const updatedItem=req.body;
            const query={_id:ObjectId(id)};
            const options={upsert:true};
            const updateDoc={
                $set:{
                    quantity:updatedItem.quantity
                }
            };
            const result=await itemsCollection.updateOne(query,updateDoc,options);
            res.send(result);
        })

        //Delete  Item
        app.delete('/items/:id',async(req,res)=>{
            const id =req.params.id;
            const query={_id:ObjectId(id)};
            const result=await itemsCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally{
        
    }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('This is Home Page');
})

app.listen(port)