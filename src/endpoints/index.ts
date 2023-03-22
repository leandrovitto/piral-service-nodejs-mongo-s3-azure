import * as core from 'express-serve-static-core';
import piletRoutes from './pilets.routes';
import { API, PILET, V1 } from './routes';

const routes = (app: core.Express) =>
  app.use(`${API}${V1}${PILET}`, piletRoutes);

export default routes;
