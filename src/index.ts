import * as core from 'express-serve-static-core';
/* eslint-disable no-console */
// eslint-disable-next-line no-console
import express from 'express';
import routes from './endpoints';
import { NODE_PORT, UPLOAD_TMP_DIR_NAME } from './setting';
import cors from 'cors';
import responseTime from 'response-time';
//import bodyParser from 'body-parser';

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

app.use(`/${UPLOAD_TMP_DIR_NAME}`, express.static(UPLOAD_TMP_DIR_NAME));

//app.use(bodyParser.json());

/* app.use(
  cors({
    origin: '*',

    credentials: true,
    optionsSuccessStatus: 200,
  }),
); */
//app.use(express.urlencoded({ extended: true }));

//app.use('/', router);
//Routing
routes(app);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
