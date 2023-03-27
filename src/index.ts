/* eslint-disable no-console */
import cors from 'cors';
import express from 'express';
import * as core from 'express-serve-static-core';
import responseTime from 'response-time';
import routes from './endpoints';
import { FULL_URL, NODE_PORT, UPLOADS__DIRECTORY, storage } from './setting';
import { KeyService } from './services/keys.service';

const app: core.Express = express();
const port = NODE_PORT || 3000;

const corsOpts = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at ${FULL_URL}`);
});

const showKeys = async () => {
  const keyService = new KeyService();
  const keys = await keyService.getKeys();
  console.log('\nAuth Keys:');
  keys.map((k) => console.log(k));
  console.log('\n');
};

showKeys();
