# piral-service-nodejs-mongo-s3-azure

Node.js application for Piral Service

- Store pilet and piletVersion in Database; 
- Prisma ORM (Choose your DB like postgres,mysql, mongodb e and so on);
- Storage the pilet file unpackage in Cloud Bucket (AWS S3, Azure) or in Local Directory (/files)
- Authentication with generate key e stored in database;
- Admin panel for disabled Pilet Module or Pilet Version (like rollback version);

Pilet feed service for use with Piral. 🚀

# Install & Run

Clone repository and launch (previous install node js)

```
npm i
```

## Set .env File

Copy .env.backup in new file .env.
Set setting for you enviroment.

## Docker Running

Install docker and run
```
docker compose up -d
```
Visit site on url : ```http://localhost:9999/```

> Enjoy 🥳    

# Admin Panel

> documentation TODO

![Admin Panel](/doc/home.png "Admin Panel")
![Admin Panel](/doc/pilet_list.png "Admin Panel")
![Admin Panel](/doc/pilet_version_list.png "Admin Panel")
![Admin Panel](/doc/api_list.png "Admin Panel")

# Api List

Go to Link, Swagger Ui 

```
http://localhost:9999/api-docs
```

![Admin Panel](/doc/swagger.png "Admin Panel")

# Setup configuration

## Storage File Pilet

Upload files with the post api ```/api/v1/pilet```, choose the storage.

Configuration .env, setting variable STORAGE_PROVIDER:

- Local (default)
  
Configuration STORAGE_PROVIDER=local for local storage.
Local storage save files in '/files' directory in root project.
- Aws

Configuration STORAGE_PROVIDER=aws for AWS storage. Set all the following variables for aws;

```
AWS_ACCESS_KEY_ID=AKIA55XK23421341341413413
AWS_SECRET_ACCESS_KEY=AZAZZAZZAzazazaZAZAZAZAZAZAZAZA
AWS_S3_DEFAULT_REGION=eu-central-1
AWS_S3_BUCKET=mybucket
AWS_S3_URL=https://s3.eu-central-1.amazonaws.com/mybucket
```
- Azure

Configuration STORAGE_PROVIDER=azure for AZURE storage. Set all the following variables for aws;
```
AZURE_CONNECTION_STRING="exampleexampleexapmple==;EndpointSuffix=core.windows.net"
AZURE_CONTAINER_NAME=files
AZURE_URL='https://example.blob.core.windows.net'
```

## Key Storage

Choose configuration KEYS_PROVIDER (default Local, not secure because the key are pre-generated)
```
# KEYS
# local | env | database
KEYS_PROVIDER=database
```

- Local

The key are pre-generater in setting.ts file (not secure), re-generate for this configuration with command node js in terminal 
```crypto.createHash('sha256').update(Math.random().toString()).digest().toString('hex')``` and paste here

```
KEYS_PROVIDER=local
KEYS=1111,2222,3333,4444
```

- Env

Add KEYS configuration in .env file, list your key separate by comma

```
KEYS_PROVIDER=env
KEYS=1111,2222,3333,4444
```

- Database
  
Add the keys in table Keys, generate auto keys with command

```
npm run prisma:seed
```

Follow the configuration in ```.env.backup``` file for configuration. For more information read the file ```src/setting.ts```.

## Database

Set DATABASE_URL for connection to DB, external when not use docker

```
DATABASE_URL="postgresql://root:root@localhost:5432/mydb?schema=public"
```

## Prisma create Migration
Edit DATABASE_URL in .env file, choose your connection.
For other database connection, like 'mongodb' change provider in file ```prisma/schema.prisma```

Run this command to create migration and table in your database
```
npm run prisma:migrate
```
Run command for generate Keys into db, in the case of KEYS_PROVIDER = database
```
npm run prisma:seed
```

## Launch the server

```
npm run start
npm run start:dev (with live reload)
```

