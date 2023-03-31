import * as core from 'express-serve-static-core';
import { Liquid } from 'liquidjs';
import { ADMIN, API, AUTH, PILET, ROOT, V1 } from './routes';

import adminRoutes from './admin.routes';
import homeRoutes from './home.routes';
import loginRoutes from './login.routes';
import piletRoutes from './pilets.routes';

const engine = new Liquid();

const routes = (app: core.Express) => {
  // Liquid setting
  app.engine('liquid', engine.express());
  app.set('views', './src/views/');
  app.set('view engine', 'liquid');

  // Routes
  app.use(AUTH, loginRoutes);
  app.use(ROOT, homeRoutes);
  app.use(ADMIN, adminRoutes);
  app.use(`${API}${V1}${PILET}`, piletRoutes);
};

export default routes;
