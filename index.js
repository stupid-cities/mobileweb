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
app.set('view engine', 'pug')

app.db = pgp(DB_URL)

app.get('/', (req, res) => {
	res.render('index')
})

app.post('/', upload.single('fileupload'), (req, res) => {
	if(req.file){
		cloudinary.v2.uploader.upload(req.file.path,
			{context: {long: req.body.long, lat: req.body.lat}},
		 	(error, result) => {
				app.db.none("INSERT INTO events (location, resource) VALUES(ST_GeomFromText('POINT($1 $2)', 4326), $3)",
					[parseFloat(req.body.long), parseFloat(req.body.lat), result.public_id])
				res.render('success')
		})
	}else{
		res.render('index');
	}
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
