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

