# Mobile Web

Runs: http://alpha.stupidcities.com

## Install

```
yarn install
```

## Running

```
DATABASE_URL='...' CLOUDINARY_URL='...' yarn start
```

## Front End

> Run `yarn dev` if you are doing any FE work to run postcss & babel on FE assets

View the pattern library at `/pattern-lib`

Add any new components to view into `pattern-library.pug`. Every component is a mixin which you then add to `components.pug` which is included in every view

There are three main views: index (home), map (view tagged locations) and add (record a location)

> Use `_starter-page.pug` to create a new page

You can send messages to a view (errors & successes for instance) by adding the following json to the response (see `add.pug`)

```
{
	"alert": true,
	"type": "error",
	"message": "We\'re sorry there was a problem uploading your image, please try again"
}
```

## Database

Local DB setup. You might have to install postgres and postgis: https://postgis.net/install

```
createdb events
```

psql 'postgresql://localhost:5432/events'

Add the following Postgres extensions (required for accurate storage and querying of long/lat geo info):

```
CREATE EXTENSION hstore;
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```

Database Migrations run through:

```
npx sequelize-cli db:migrate
```

