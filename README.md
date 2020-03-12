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

> Run `yarn dev` if you are doing any FE work to run postcss & babel on FE assets


## Database

Local DB setup

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

