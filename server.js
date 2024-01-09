const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = // Need to create MongoDB connectionString for our own database and store in .env file. Do not push string to GH!

    MongoClient.connect(connectionString)
        .then(client => {
            console.log('Connected to Database')
            const db = client.db('star-wars-quotes') // Need to replace 'star-wars-quotes' with new MongoDB info
            const quotesCollection = db.collection('quotes') // Need to replace quotesCollection and 'quotes' with new MongoDB info

            app.set('view engine', 'ejs')

            app.use(bodyParser.urlencoded({ extended: true }))
            app.use(express.static('public'))
            app.use(bodyParser.json()) // Is this deprecated?

            app.get('/', (req, res) => {
                quotesCollection.find().toArray() // Need to replace quotesCollection with new MongoDB info
                    .then(results => {
                        res.render('index.ejs', { quotes: results }) // Need to replace { quotes: results } with new MongoDB info
                    })
                    .catch(error => console.error(error))
            })

            // Replace '/quotes' in below routes with new info
            app.post('/quotes', (req, res) => {
                quotesCollection.insertOne(req.body)
                    .then(result => {
                        res.redirect('/')
                    })
                    .catch(error => console.log(error))
            })

            // Replace '/quotes' in below routes with new info
            app.put('/quotes', (req, res) => {
                // Need to replace below with updated findOneAndUpdate info, as well as quotesCollection with new MongoDB Info
                quotesCollection.findOneAndUpdate(
                    { name: 'Yoda' },
                    {
                        $set: {
                            name: req.body.name,
                            quote: req.body.quote
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

            // Replace '/quotes' in below routes with new info
            app.delete('/quotes', (req, res) => {
                quotesCollection.deleteOne(
                    { name: req.body.name }
                )
                    .then(result => {
                        if (result.deletedCount === 0) {
                            return res.json('No quote to delete')
                        }
                        res.json(`Deleted Darth Vader's Quote`)
                    })
                    .catch(error => console.error(error))
            })

            app.listen(3000, function () {
                console.log('listening on 3000')
            })
        })
        .catch(error => console.error(error))



