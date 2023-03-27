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
const PILET_VERSION = ENV.PILET_VERSION || 'v3';

const HOST = ENV.WEBSITE_HOSTNAME || `localhost:${NODE_PORT}`;
const PROTOCOL = ENV.HTTP_X_FORWARDED_PROTO || 'http';
const FULL_URL = `${PROTOCOL}://${HOST}`;

const storage = {
  provider: ENV.STORAGE_PROVIDER ? ENV.STORAGE_PROVIDER : 'local', // 'local', 'aws', 'azure'
  localSettings: {
    bucket: 'files',
  },
  awsSettings: {
    directory: 'files',
    accessKeyId: ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
    region: ENV.AWS_S3_DEFAULT_REGION,
    bucket: ENV.AWS_S3_BUCKET || '',
    url: ENV.AWS_S3_URL,
    acl: ENV.AWS_S3_ACL || 'public-read', //'public-read'
  },
  azureSettings: {
    connectionString: ENV.AZURE_CONNECTION_STRING || '',
    containerName: ENV.AZURE_CONTAINER_NAME || 'files',
    url: ENV.AZURE_URL,
    acl: ENV.AZURE_ACCESS_TYPE || 'blob', //'public-read'
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
  PILET_VERSION,
};
