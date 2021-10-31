const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId

//initialization
const app = express()

app.use(express.json())
app.use(cors())


//monogdb Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@noyonecommerce.qnayd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

app.get('/', (req, res) => {
  res.send('Running my CRUD Server')
})

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
)




const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function run() {
  try {
    await client.connect()
    //Tourist Collection
    const TouristCollection = client.db('touristMenia').collection('tourist')
    //Tourist Oreder Collection
    const TouristOrderCollection = client
      .db('touristMenia')
      .collection('touristOrder')
    //Tourist Place Info
    const TouristPlaceInfo = client
      .db('touristMenia')
      .collection('touristPlaceInfo')
    //Faq
    const FaqInfo = client.db('touristMenia').collection('faq')
    //Gallery
    const Gallery = client.db('touristMenia').collection('ImageCollection')

    /* Tourist Place Information
        get: /allTouristPlace
        post: /addTouristPlace
        getById: /allTouristPlace/:id
        update: /allTouristPlace/:id
        delete: /deleteTouristInfo/:id
        faq: /faq
    */
    // add touristplace
    app.post('/addTouristPlace', async (req, res) => {
      const result = await TouristPlaceInfo.insertOne(req.body)
      res.json(result)
    })

    // GET touristPlace
    app.get('/allTouristPlace', async (req, res) => {
      const cursor = TouristPlaceInfo.find({})
      const touristPlaces = await cursor.toArray()
      res.json(touristPlaces)
    })

    // GET single touristPlace
    app.get('/allTouristPlace/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const touristPlace = await TouristPlaceInfo.findOne(query)
      res.json(touristPlace)
    })

    //Update touristPlace
    app.put('/allTouristPlace/:id', async (req, res) => {
      const id = req.params.id
      const updateTplaceInfo = req.body
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          title: updateTplaceInfo.title,
          description: updateTplaceInfo.description,
          image: updateTplaceInfo.image,
          price: updateTplaceInfo.price,
        },
      }
      const result = await TouristPlaceInfo.updateOne(
        filter,
        updateDoc,
        options
      )
      res.json(result)
    })
    // delete touristPlacesInfo
    app.delete('/deleteTouristInfo/:id', async (req, res) => {
      const result = await TouristPlaceInfo.deleteOne({
        _id: ObjectId(req.params.id),
      })
      res.send(result)
    })

    /* Tourist Information
        get: /allTourists
        post: /addTourist
        post: /contactUs
    */
    // add tourist
    app.post('/addTourist', async (req, res) => {
      const result = await TouristCollection.insertOne(req.body)
      res.json(result)
    })
    app.post('/contactUs', async (req, res) => {
      const result = await TouristCollection.insertOne(req.body)
      res.json(result)
    })

    // get all tourists
    app.get('/allTourists', async (req, res) => {
      const result = await TouristCollection.find({}).toArray()
      res.json(result)
    })
    /* Tourist Order
        
        post: /addTouristOrder
        get: /myOrder/:email
        delete: /myOrder/:id
        getAll: /allOrders
        delete:/allOrders/:id
        put: /allOrders/:id
        get: /allOrders/:id
    */
    // add touristOrder
    app.post('/addTouristOrder', async (req, res) => {
      const result = await TouristOrderCollection.insertOne(req.body)
      res.json(result)
    })
    // my Orders
    app.get('/myOrder/:email', async (req, res) => {
      const result = await TouristOrderCollection.find({
        email: req.params.email,
      }).toArray()
      res.send(result)
    })
    //get single orders
    app.get('/allOrders/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const singleOrder = await TouristOrderCollection.findOne(query)
      res.json(singleOrder)
    })
    // delete myOrder
    app.delete('/myOrder/:id', async (req, res) => {
      const result = await TouristOrderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      })
      res.send(result)
    })

    // GET allOrders
    app.get('/allOrders', async (req, res) => {
      const cursor = TouristOrderCollection.find({})
      const touristOrders = await cursor.toArray()
      res.json(touristOrders)
    })

    // delete allOrder
    app.delete('/allOrders/:id', async (req, res) => {
      const result = await TouristOrderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      })
      res.send(result)
    })
    //Update panding state
    app.put('/allOrders/:id', async (req, res) => {
      const id = req.params.id
      const updateTplaceInfo = req.body
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          pending: updateTplaceInfo.pending,
        },
      }
      const result = await TouristOrderCollection.updateOne(
        filter,
        updateDoc,
        options
      )
      res.json(result)
    })
    /* Faq
        get: /faq

    */
    // GET faq
    app.get('/faq', async (req, res) => {
      const cursor = FaqInfo.find({})
      const faq = await cursor.toArray()
      res.json(faq)
    })
    /* Faq
        get: /gallery
        post: /gallery

    */
    // GET faq
    app.get('/gallery', async (req, res) => {
      const cursor = Gallery.find({})
      const gallery = await cursor.toArray()
      res.json(gallery)
    })

    // POST gallery
    app.post('/gallery', async (req, res) => {
      const result = await Gallery.insertOne(req.body)
      res.json(result)
    })
  } finally {
    // await client.close();
  }
}

run().catch(console.dir)

