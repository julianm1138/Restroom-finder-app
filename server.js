const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = ''

MongoClient.connect(connectionString)
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('restroom_locations')
    const restroomsCollection = db.collection('restrooms')

    app.set('view engine', 'ejs')

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    app.get('/', (req, res) => {
        restroomsCollection.find().toArray()
            .then(results => {
                res.render('index.ejs',{restrooms: results})
            })
            .catch(error => console.error(error))   
    })

    app.post('/restrooms', (req, res) => {
        restroomsCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/')
            })
            .catch(error => console.log(error))
    })

    app.put('/restrooms', (req,res) => {
        restroomsCollection.findOneAndUpdate(
            {name: 'Yoda'},
            {
                $set: {
                    name: req.body.name,
                    restroom: req.body.restroom
              }
            },
            {
                upsert: true
            }
        )
        .then(result => {
            res.json('Success') 
        })
        .catch(error => console.error(error))
    })

    app.delete('/restrooms', (req, res) => {
        restroomsCollection.deleteOne(
          {name: req.body.name}  
        )
        .then(result => {
            if (result.deletedCount === 0) {
                return res.json('No restroom to delete')
            }
            res.json(`Deleted Restroom`)
        })
        .catch(error => console.error(error))
    })

    app.listen(3000, function() {
        console.log('listening on 3000')
    })
  })
  .catch(error => console.error(error))



