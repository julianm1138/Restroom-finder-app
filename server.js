const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = '' //add to env after adding user permissions

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

    //add restroom
    app.post('/restrooms', (req, res) => {
        restroomsCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/')
            })
            .catch(error => console.log(error))
    })

    /*
    //update exisiting document. Not sure this is necessary for now
    
    app.put('/restrooms', (req, res) => {
       
        quotesCollection.findOneAndUpdate(
            { name: '' },
            {
                $set: {
                    name: req.body.name,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    zip_code: req.body.zip_code,
                    opens: req.body.open_hours,
                    closes: req.body.closed_hours
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
    */



    //delete restroom
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



