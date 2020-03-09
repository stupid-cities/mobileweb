# Mobile Web

## Install

```
yarn install
```

## Running

```
DATABASE_URL='...' CLOUDINARY_URL='...' yarn start
```


## Database

Postgres with following extensions (required for accurate storage and querying of long/lat geo info):

```
CREATE EXTENSION hstore;
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```

Database Migrations run through:

```
npx sequelize-cli db:migrate
```
