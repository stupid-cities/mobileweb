# heroku-cloudinary-uploads-example

Initial Heroku app config

1. heroku login
2. heroku create
3. git push heroku master

Add heroku add-on - after setting up heroku app

```heroku addons:create cloudinary```

to see the config variables (cloudinary api key and secret)

```heroku config```

To copy the env variable to set up local environment variable:

```heroku config -s | grep CLOUDINARY >> .env```