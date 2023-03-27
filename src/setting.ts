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
  provider: ENV.STORAGE_PROVIDER ? ENV.STORAGE_PROVIDER : 'local', // local | aws | azure
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

// crypto.createHash('sha256').update(Math.random().toString()).digest().toString('hex')
const generatedKeys = [
  '779baae4ade607786c6cdbfc47b55dcbf2d7c519ddf29ffd0087b7c2c604715c',
  'ad647bdc23b7437b8fa8f27c3e2d3f70fbb493c53e9160e07d37a98df333b188',
  'c2d98c4869b06f23cb1e82a1f87008e3b47ce6276aad0648f51223334fa5dd30',
  'f4016914386b30c733e03ca76a36a0c45406fbda4e66be1c6af63dc908a3c075',
  '1848113284a55529e1c0d60de12e3d50e721d8ff189d96d474aa9101ead1d034',
];

const authKeys = {
  provider: ENV.KEYS_PROVIDER || 'local', // local | env || database
  envKeys: ENV.KEYS || '',
  defaultKeys: generatedKeys,
};

export {
  storage,
  authKeys,
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
