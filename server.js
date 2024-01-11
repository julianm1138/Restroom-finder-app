const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID;
const PORT = 3000
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'restroom_locations'

//connects to MongoDB with string
MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//main page
app.get('/', (req, res) => {
    db.collection('restrooms').find().toArray()
        .then(result => {
            res.render('index.ejs', { toilets: [] })
        })
        .catch(error => console.error(error))
})

//find a restroom
app.post('/find', (req, res) => {
    let search = {};

    if (req.body.city) {
        search.City = req.body.city;
    }
    if (req.body.state) {
        search.CountrySubdivisionCode = req.body.state.toUpperCase();
    }
    if (req.body.zip) {
        const zipCodeStart = parseInt(req.body.zip + '0000', 10);
        const zipCodeEnd = parseInt(req.body.zip + '9999', 10);
        search.PostalCode = { $gte: zipCodeStart, $lte: zipCodeEnd };
    }
    if (req.body.country) {
        search.CountryCode = req.body.country;
    }

    db.collection('restrooms').find(search).toArray()
        .then(result => {
            const foundRestrooms = result.map(item => {
                return {
                    BrandName: item.BrandName,
                    Street1: item.Street1,
                    City: item.City,
                    State: item.CountrySubdivisionCode,
                    PostalCode: item.PostalCode.toString().substring(0, 5),
                    PhoneNumber: item.PhoneNumber,
                    Upvotes: item.Upvotes,
                    Downvotes: item.Downvotes
                };
            });
            res.render('index.ejs', { toilets: foundRestrooms })
        })
        .catch(error => console.error(error))
})


//upvote restroom

app.put('/voteUp', (req, res) => {
    console.log("Received request body:", req.body);
    db.collection('restrooms').findOneAndUpdate({ _id: (req.body._id).trim() }, {
        $inc: { Upvotes: 1 }
    }, {
        upsert: false
    })
        .then(result => {
            console.log('Update result:', result)
            if (result.matchedCount === 0) {
                console.log('No matching document found');
            }
            if (result.modifiedCount === 0) {
                console.log('No document was modified');
            }
            res.json('Restroom Upvoted!')
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
        });
})


//downvote restroom
app.put('/voteDown', (req, res) => {
    db.collection('restrooms').updateOne({ _id: new ObjectId(req.body._id) }, {
        $inc: { Downvotes: 1 }
    }, {
        upsert: false
    })
        .then(result => {
            console.log('Restroom Downvoted!')
            res.json('Restroom Downvoted!')
        })
        .catch(error => console.error(error))
})


//delete restroom
app.delete('/restrooms', (req, res) => {
    db.collection('restrooms').deleteOne(
        { name: req.body.name }
    )
        .then(result => {
            if (result.deletedCount === 0) {
                return res.json('No restroom to delete')
            }
            res.json(`Deleted Restroom`)
        })
        .catch(error => console.error(error))
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
