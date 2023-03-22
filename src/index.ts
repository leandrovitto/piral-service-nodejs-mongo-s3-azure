/* eslint-disable no-console */
// eslint-disable-next-line no-console
import express from 'express';
import dotenv from 'dotenv';

//-----NODE ENV------
const PRODUCTION = 'production';

if (process.env.NODE_ENV !== PRODUCTION) {
  dotenv.config();
}
console.log('NODE_ENV:', process.env.NODE_ENV);
//-----NODE ENV------

const app = express();
const port = process.env.NODE_PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
