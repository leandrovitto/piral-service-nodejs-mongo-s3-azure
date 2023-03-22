import * as core from 'express-serve-static-core';
/* eslint-disable no-console */
// eslint-disable-next-line no-console
import express from 'express';
import { NODE_PORT } from './setting';
import routes from './endpoints';
import bodyParser from 'body-parser';

const app: core.Express = express();
const port = NODE_PORT || 3000;

// const router = express.Router();
app.use(bodyParser.json()); //application/json
//app.use('/', router);
//Routing
routes(app);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
