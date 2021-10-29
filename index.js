const express = require('express');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId ;
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cowhf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try{
        await client.connect();
        
        const database = client.db('perfect-fit');
        const serviceCillection = database.collection('services');

        // GET api
        app.get('/services', async(req, res) => {
            const cursor = serviceCillection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // get a single item 
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id ;
            const query = {_id : ObjectId(id)};
            const service = await serviceCillection.findOne(query);
            res.send(service)
        })

        // POST api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
    
            const result = await serviceCillection.insertOne(service);
            console.log(result);

            res.json(result);
        })

        // DELETE api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await serviceCillection.deleteOne(query);
            res.send(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('<h1>This is my own server</h1>')
})

app.listen(port, () => {
    console.log('Running the Perfect-fit server port', port);
})