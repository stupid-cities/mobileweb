require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
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
app.use(cookieParser());
app.use(express.static('public'))
app.set('view engine', 'pug')
app.db = pgp(DB_URL+"?ssl=true")

// homepage
app.get('/', (req, res) => {
	res.render('index')
})
// add a point
app.get('/add', (req, res) => {
	hasInfo = true;
	if(req.cookies && req.cookies['alert_shown']){
			//User has seen alert, hide it.
			hasInfo = false;
	}
	res.render('add', {hasInfo: hasInfo});
})
// populated map view
app.get('/map', (req, res) => {
	res.render('map')
})

// retrieve points
app.get('/events', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	app.db.any("select ST_X(ST_Centroid(ST_Transform(location, 4326))) AS long, ST_Y(ST_Centroid(ST_Transform(location, 4326))) AS lat, resource, rating from events LIMIT 1000;")
		.then(data => {
			geojson = {
				"type": "FeatureCollection",
				"features": data.map(cord =>
					feature = {
						"type": "Feature",
						"properties": { "resource": cord.resource, "rating": cord.rating },
						"geometry": { "type": "Point", "coordinates": [cord.long, cord.lat] }
					})
			}
			res.end(JSON.stringify(geojson));
		})
		.catch(error => {
			console.log('ERROR:', error);
		})
})

// post event data
app.post('/events/:id', (req, res) => {
	eventId = parseInt(req.params.id);
	notes = req.body.notes
	impact = req.body.mood
	category = req.body.category
	if(eventId && (notes || impact || category)){
		app.db.none("UPDATE events SET notes=$1, rating=$2, category=$3 where id=$4 AND (rating IS NULL)",
		[notes, impact, category, eventId])
	}
	res.cookie('alert_shown', 'true', {expires: new Date(Date.now() + 8 * 3600000)})
	res.redirect("/add")
})
// post lat/lng and image
app.post('/add', upload.single('fileupload'), (req, res) => {
	if(req.file){
		cloudinary.v2.uploader.upload(req.file.path,
			{context: {long: req.body.long, lat: req.body.lat}},
		 	(error, result) => {
		 		app.db.one("INSERT INTO events (location, resource) VALUES(ST_GeomFromText('POINT($1 $2)', 4326), $3) RETURNING id",
		 			[parseFloat(req.body.long), parseFloat(req.body.lat), result.public_id])
					.then(data => {
						eventId = data.id
						res.json({"eventId": eventId});
					})
						.catch(error => {
							// send back to add page with error to try again
							res.json({"alert": true, "type": "error", "message": "We\'re sorry there was a problem uploading your image, please try again"});
        			console.log('ERROR:', error); // print error;
    			});
		})
	}else{
		res.json({"alert": true, "type": "error", "message": "We\'re sorry there was a problem uploading your image, please try again"})
	}
})


app.get('/-/health', (req, res) => {
	app.db.none("select true");
})

app.get('/pattern-lib', (req, res) => {
	res.render('pattern-library')
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
