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

export { NODE_ENV, NODE_PORT, PRODUCTION };
