import * as core from 'express-serve-static-core';
import { API, PILET, ROOT, V1 } from './routes';
import piletRoutes from './pilets.routes';
import viewRoutes from './view.routes';

import { Liquid } from 'liquidjs';
const engine = new Liquid();

const routes = (app: core.Express) => {
  // Liquid setting
  app.engine('liquid', engine.express());
  app.set('views', './src/views/');
  app.set('view engine', 'liquid');

  // Routes
  app.use(ROOT, viewRoutes);
  app.use(`${API}${V1}${PILET}`, piletRoutes);
};

export default routes;
