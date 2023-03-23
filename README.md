# piral-service-nodejs-mongo-s3-azure
A simple Node.js, with store Mongo DB and S3/Azure bucket sample pilet feed service for use with Piral. 🚀


# Prisma create Migration
Edit DATABASE_URL in .env file, choose your connection.
For other database connection, like 'mongodb' change provider in prisma/schema.prisma

Run this command to create migration and table in your database
```
npx prisma migrate dev --name init
```