/* eslint-disable no-console */
import * as dotenv from 'dotenv';
const ENV = process.env || {};

const PRODUCTION = 'production';
const DEVELOPMENT = 'development';

if (process.env.NODE_ENV !== PRODUCTION) dotenv.config();
//-----NODE ENV-----
const NODE_ENV = ENV.NODE_ENV || DEVELOPMENT;
console.log('NODE_ENV:', NODE_ENV);

const NODE_PORT = ENV.NODE_PORT || 3000;
//----------------------
const UPLOADS__DIRECTORY = 'uploads';
const TGZ_OUTPUT__DIRECTORY = 'package';
const BUILD_OUTPUT__DIRECTORY = 'dist';
const PACKAGE_JSON__FILE = 'package.json';

const HOST = ENV.WEBSITE_HOSTNAME || `localhost:${NODE_PORT}`;
const PROTOCOL = ENV.HTTP_X_FORWARDED_PROTO || 'http';
const FULL_URL = `${PROTOCOL}://${HOST}`;

const storage = {
  provider: ENV.STORAGE_PROVIDER ? ENV.STORAGE_PROVIDER : 'local', // 'local', 'aws', 'azure'
  localSettings: {
    bucket: 'files',
  },
  awsSettings: {
    accessKeyId: ENV.S3_USER_KEY,
    secretAccessKey: ENV.S3_USER_SECRET,
    bucket: ENV.S3_BUCKET_NAME,
  },
  azureSettings: {
    accessKeyId: ENV.AZURE_USER_KEY,
    secretAccessKey: ENV.AZURE_USER_SECRET,
    bucket: ENV.AZURE_BUCKET_NAME,
  },
};

export {
  storage,
  HOST,
  PROTOCOL,
  FULL_URL,
  NODE_ENV,
  NODE_PORT,
  PRODUCTION,
  TGZ_OUTPUT__DIRECTORY,
  UPLOADS__DIRECTORY,
  BUILD_OUTPUT__DIRECTORY,
  PACKAGE_JSON__FILE,
};
