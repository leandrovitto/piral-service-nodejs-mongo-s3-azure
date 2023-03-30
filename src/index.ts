/* eslint-disable no-console */
import cors from 'cors';
import express from 'express';
import * as core from 'express-serve-static-core';
import responseTime from 'response-time';
import routes from './endpoints';
import { KeyService } from './services/keys.service';
import { FULL_URL, NODE_PORT, UPLOADS__DIRECTORY, storage } from './setting';
import { logger } from './helpers';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';

const app: core.Express = express();
const port = NODE_PORT || 3000;

export const prismaClient = new PrismaClient();

const corsOpts = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors(corsOpts));
app.use(express.json());
app.use(responseTime());

app.use(`/${UPLOADS__DIRECTORY}`, express.static(UPLOADS__DIRECTORY));
app.use(
  `/${storage.localSettings.bucket}`,
  express.static(storage.localSettings.bucket),
);

//Routing
routes(app);

app.listen(port, () => {
  return console.log(`Express is listening at ${FULL_URL}`);
});

const showKeys = async () => {
  const keyService = new KeyService();
  const keys = await keyService.getKeys();
  logger('\nAuth Keys:', '');
  keys.map((k) => logger(k, ''));
  logger('\n', '');
};

showKeys();
