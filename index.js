const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const multer = require('multer')
const pug = require('pug')
const cloudinary = require('cloudinary')
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

app.get('/', (req, res) => {
	cloudinary.v2.api.resources((error, result) => {
		// console.log(result)

		const links = []
		for (let i = 0; i < result.resources.length; i += 1) {
			links.push({
				title: result.resources[i].public_id,
				link: result.resources[i].secure_url
			})
		}

		res.render('index', { links })
	})
})

app.post('/', upload.single('fileupload'), (req, res) => {
	if(req.file){
	cloudinary.v2.uploader.upload(req.file.path,
		{context: {long: req.body.long, lat: req.body.lat}},
		 (error, result) => {
		console.log(error);
		res.render('success')
	})
}else{
	res.render('index');
}
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
