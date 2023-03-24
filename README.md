# piral-service-nodejs-mongo-s3-azure

Node.js application for Piral Service

- Store pilet and pilvetVersion in Database; 
- Prisma ORM (Choose your DB like postgres,mysql, mongodb e and so on);
- Storage the pilet file unpackage in Cloud Bucket (AWS S3, Azure) or in Local Directory (/files)
- Authentication with generate key e stored in database;
- Admin panel for disabled Pilet Module or Pilet Version (like rollback version);

Pilet feed service for use with Piral. 🚀

# Install & Setup

Clone repository and launch (previous install node js)

```
npm i
```

### Set .env File

Copy .env.backup in new file .env.
Set setting for you enviroment.
First set DATABASE_URL for connection to DB

```
DATABASE_URL="postgresql://root:root@localhost:5432/mydb?schema=public"
```

### Prisma create Migration
Edit DATABASE_URL in .env file, choose your connection.
For other database connection, like 'mongodb' change provider in prisma/schema.prisma

Run this command to create migration and table in your database
```
npm run prisma:migrate
```

Launch the server

```
npm run start
npm run start:dev (with live reload)
```

