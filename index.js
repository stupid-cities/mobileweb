require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const multer = require('multer')
const pug = require('pug')
const cloudinary = require('cloudinary')
const pgp = require('pg-promise')()
const DB_URL = process.env.DATABASE_URL
const PORT = process.env.PORT || 4004

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})
const upload = multer({ storage: storage })
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'pug')

app.db = pgp(DB_URL)

app.get('/', (req, res) => {
	res.render('index')
})

app.post('/events/:id', (req, res) => {
	eventId = parseInt(req.params.id);
	notes = req.body.notes
	impact = req.body.emotion
	category = req.body.category
	if(eventId && (notes || impact || category)){
		app.db.none("UPDATE events SET notes=$1, rating=$2, category=$3 where id=$4 AND (rating IS NULL)",
		[notes, impact, category, eventId])
	}
	res.redirect("/")
})

app.post('/', upload.single('fileupload'), (req, res) => {
	if(req.file){
		cloudinary.v2.uploader.upload(req.file.path,
			{context: {long: req.body.long, lat: req.body.lat}},
		 	(error, result) => {
		 		app.db.one("INSERT INTO events (location, resource) VALUES(ST_GeomFromText('POINT($1 $2)', 4326), $3) RETURNING id",
		 			[parseFloat(req.body.long), parseFloat(req.body.lat), result.public_id])
					.then(data => {
						eventId= data.id
						res.render('success', {"eventId": eventId})
					})
					.catch(error => {
        		console.log('ERROR:', error); // print error;
    			});
		})
	}else{
		res.render('index');
	}
})

app.get('/map', (req, res) => {
	res.render('map')
})

app.get('/events', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	app.db.any("select ST_X(ST_Centroid(ST_Transform(location, 4326))) AS long, ST_Y(ST_Centroid(ST_Transform(location, 4326))) AS lat, resource from events LIMIT 1000;")
	.then(data => {
		geojson = {"type": "FeatureCollection",
	    				 "features": data.map(cord =>
				 			 	feature = {"type": "Feature",
				  								 "properties": {"resource": cord.resource},
													 "geometry":   {"type":"Point","coordinates":[cord.long, cord.lat]}})
							}
		res.end(JSON.stringify(geojson));
	})
	.catch(error => {
  	console.log('ERROR:', error);
  })
})

app.get('/-/health', (req, res) => {
	app.db.none("select true");
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
