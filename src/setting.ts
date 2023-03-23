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
const TAR_DIR_NAME = 'package';
const UPLOAD_TMP_DIR_NAME = 'files';

const HOST = ENV.WEBSITE_HOSTNAME || `localhost:${NODE_PORT}`;
const PROTOCOL = ENV.HTTP_X_FORWARDED_PROTO || 'http';
const FULL_URL = `${PROTOCOL}://${HOST}`;

export {
  HOST,
  PROTOCOL,
  FULL_URL,
  NODE_ENV,
  NODE_PORT,
  PRODUCTION,
  TAR_DIR_NAME,
  UPLOAD_TMP_DIR_NAME,
};
