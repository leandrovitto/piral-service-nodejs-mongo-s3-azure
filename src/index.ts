/* eslint-disable no-console */
import * as core from 'express-serve-static-core';
import express from 'express';
import routes from './endpoints';
import { NODE_PORT, UPLOADS__DIRECTORY, storage } from './setting';
import cors from 'cors';
import responseTime from 'response-time';

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
  return console.log(`Express is listening at http://localhost:${port}`);
});
